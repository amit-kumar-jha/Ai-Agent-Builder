import mongoose from 'mongoose';
import AgentModel from '@/models/AgentModel';
import ExecutionModel from '@/models/ExecutionModel';
import { LLMClient } from './LLMClient';
import { ToolExecutor } from './ToolExecutor';
import { TokenCounter } from './TokenCounter';
import { CacheService } from './CacheService';
import { interpolate, interpolateConfig } from '../utils/interpolate';
import { sanitizeObject, hashString, generateExecutionId } from '../utils/helpers';
import { BUILTIN_TOOLS } from '../constants/tools';
import connectDB from '@/lib/mongoose';

export class AgentEngine {
  private llm: LLMClient;
  private tools: ToolExecutor;
  private tokenCounter: TokenCounter;
  private cache: CacheService;

  constructor() {
    this.llm = new LLMClient();
    this.tools = new ToolExecutor();
    this.tokenCounter = new TokenCounter();
    this.cache = new CacheService();
  }

  async executeAgent(agentId: string, input: any, context: any = {}) {
    await connectDB();

    const agent = await AgentModel.findById(agentId);
    if (!agent) throw new Error(`Agent not found: ${agentId}`);

    const executionId = new mongoose.Types.ObjectId();
    const execId = generateExecutionId();

    const execution = new ExecutionModel({
      _id: executionId,
      agentId,
      agentVersion: agent.activeVersion,
      userId: context.userId,
      teamId: context.teamId,
      executionId: execId,
      input,
      source: context.source || 'api',
      sourceIp: context.ip,
      userAgent: context.userAgent,
      status: 'running',
      trace: [],
      startedAt: new Date(),
    });
    await execution.save();

    const state: any = { node_input: input, ...input };
    const trace: any[] = [];
    let totalCost = 0;
    let totalLatency = 0;
    let totalTokens = 0;

    try {
      const { nodes, connections } = agent.workflow as { nodes: any[]; connections: any[] };
      const nodeMap = new Map(nodes.map((n: any) => [n.id, n]));
      const connMap = new Map<string, string[]>();
      connections.forEach((c: any) => {
        if (!connMap.has(c.from)) connMap.set(c.from, []);
        const targets = Array.isArray(c.to) ? c.to : [c.to];
        connMap.get(c.from)!.push(...targets);
      });

      let currentNodeId: string | null = this.findStartNode(nodes)?.id;
      const visited = new Set<string>();
      const maxSteps = 100;
      let steps = 0;

      while (currentNodeId && steps < maxSteps) {
        steps++;
        if (visited.has(currentNodeId) && steps > nodes.length * 2) break;
        visited.add(currentNodeId);

        const node = nodeMap.get(currentNodeId);
        if (!node) break;

        const startTime = Date.now();

        try {
          const nodeResult = await this.executeNode(node, state, {
            agentId, executionId, userId: context.userId, settings: agent.settings,
          });

          const latency = Date.now() - startTime;
          totalLatency += latency;

          const traceEntry: any = {
            nodeId: node.id, type: node.type, status: 'completed',
            startedAt: new Date(startTime), endedAt: new Date(), latency,
            input: sanitizeObject(nodeResult.input || {}),
            output: sanitizeObject(nodeResult.output || {}),
            error: null,
          };

          if ('cost' in nodeResult && nodeResult.cost) { totalCost += nodeResult.cost as number; traceEntry.cost = nodeResult.cost; }
          if ('tokensUsed' in nodeResult && nodeResult.tokensUsed) { 
            const tu = nodeResult.tokensUsed as any;
            traceEntry.tokensUsed = tu; 
            totalTokens += tu.total || 0; 
          }
          if ('cacheHit' in nodeResult && nodeResult.cacheHit) { traceEntry.cacheHit = true; }

          trace.push(traceEntry);
          state[node.id] = { outputs: nodeResult.output, status: 'completed' };

          if (node.type === 'decision' && ('nextNodeId' in nodeResult) && (nodeResult as any).nextNodeId) {
            currentNodeId = (nodeResult as any).nextNodeId;
          } else {
            const nextNodes = connMap.get(node.id);
            currentNodeId = nextNodes && nextNodes.length > 0 ? nextNodes[0] : null;
          }
        } catch (err: any) {
          const latency = Date.now() - startTime;
          totalLatency += latency;

          trace.push({
            nodeId: node.id, type: node.type, status: 'failed',
            startedAt: new Date(startTime), endedAt: new Date(), latency,
            input: {}, output: null, error: err.message,
          });

          const errorPolicy = agent.settings?.onError || 'stop';
          if (errorPolicy === 'skip') {
            const nextNodes = connMap.get(node.id);
            currentNodeId = nextNodes && nextNodes.length > 0 ? nextNodes[0] : null;
          } else {
            throw err;
          }
        }
      }

      const endNode = this.findEndNode(nodes);
      const output = state[endNode?.id]?.outputs || {};

      execution.output = output;
      execution.trace = trace;
      execution.totalCost = totalCost;
      execution.totalLatency = totalLatency;
      execution.totalTokens = totalTokens;
      execution.status = 'completed';
      execution.endedAt = new Date();
      await execution.save();

      await AgentModel.findByIdAndUpdate(agentId, {
        $inc: { 'stats.totalExecutions': 1, 'stats.successCount': 1, 'stats.totalTokens': totalTokens, 'stats.costToDate': totalCost },
        $set: { 'stats.lastExecutedAt': new Date() },
      });

      return { executionId: execId, output, trace, totalCost, totalLatency, totalTokens, status: 'completed' };
    } catch (err: any) {
      execution.status = 'failed';
      execution.error = err.message;
      execution.trace = trace;
      execution.totalCost = totalCost;
      execution.totalLatency = totalLatency;
      execution.endedAt = new Date();
      await execution.save();

      await AgentModel.findByIdAndUpdate(agentId, {
        $inc: { 'stats.totalExecutions': 1, 'stats.errorCount': 1 },
      });

      throw err;
    }
  }

  private async executeNode(node: any, state: any, context: any) {
    switch (node.type) {
      case 'input':
        return { input: state, output: state, cost: 0 };
      case 'llm':
        return this.executeLLMNode(node, state, context);
      case 'tool':
        return this.executeToolNode(node, state);
      case 'decision':
        return this.executeDecisionNode(node, state);
      case 'action':
        return this.executeActionNode(node, state);
      case 'output':
        const outputData = node.config?.outputSchema
          ? interpolateConfig(node.config.outputSchema, state)
          : state;
        return { input: {}, output: outputData, cost: 0 };
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }

  private async executeLLMNode(node: any, state: any, context: any) {
    const config = node.config || {};
    const prompt = interpolate(config.prompt || '', state);
    const systemPrompt = config.systemPrompt ? interpolate(config.systemPrompt, state) : undefined;
    const model = config.model || 'gpt-4';

    if (context.settings?.cacheEnabled !== false) {
      const cacheKey = `llm:${context.agentId}:${node.id}:${hashString(prompt)}`;
      const cached = await this.cache.get(cacheKey);
      if (cached) {
        return { input: { prompt, model }, output: cached.output, cost: 0, tokensUsed: cached.tokensUsed, cacheHit: true };
      }
    }

    const tools = (config.tools || []).map((t: any) => {
      const builtinTool = BUILTIN_TOOLS[t.id];
      return {
        name: builtinTool?.name || t.name || t.id,
        description: builtinTool?.description || t.description || '',
        schema: builtinTool?.inputs || t.schema || {},
      };
    });

    const llmResponse = await this.llm.chat({
      model,
      messages: [
        ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
        { role: 'user', content: prompt },
      ],
      tools: tools.length > 0 ? tools : undefined,
      temperature: config.temperature ?? 0.7,
      maxTokens: config.maxTokens || 1000,
    });

    const tokensUsed = llmResponse.usage
      ? { prompt: llmResponse.usage.prompt_tokens, completion: llmResponse.usage.completion_tokens, total: llmResponse.usage.total_tokens || (llmResponse.usage.prompt_tokens + llmResponse.usage.completion_tokens) }
      : this.tokenCounter.count(prompt, llmResponse.text || '', model);

    const cost = this.tokenCounter.estimateCost(tokensUsed, model);

    let finalOutput: any = llmResponse.text;

    if (llmResponse.toolCalls && llmResponse.toolCalls.length > 0) {
      const toolResults = [];
      for (const call of llmResponse.toolCalls) {
        const toolResult = await this.tools.execute(call.name, call.args);
        toolResults.push({ toolName: call.name, input: call.args, output: toolResult });
      }
      finalOutput = { text: llmResponse.text, toolCalls: llmResponse.toolCalls, toolResults };
    }

    if (context.settings?.cacheEnabled !== false) {
      const cacheKey = `llm:${context.agentId}:${node.id}:${hashString(prompt)}`;
      await this.cache.set(cacheKey, { output: finalOutput, tokensUsed }, context.settings?.cacheTTL || 3600);
    }

    return { input: { prompt, model }, output: finalOutput, cost, tokensUsed };
  }

  private async executeToolNode(node: any, state: any) {
    const config = node.config || {};
    const inputs = interpolateConfig(config.inputs || {}, state);
    const output = await this.tools.execute(config.toolId, inputs);
    return { input: inputs, output, cost: 0 };
  }

  private executeDecisionNode(node: any, state: any) {
    const config = node.config || {};
    let conditionResult = false;

    try {
      const conditionStr = interpolate(config.condition || 'false', state);
      conditionResult = Boolean(new Function('state', `with(state){ return (${conditionStr}); }`)(state));
    } catch {
      conditionResult = false;
    }

    const nextNodeId = conditionResult ? config.thenNodeId : config.elseNodeId;
    return {
      input: { condition: config.condition },
      output: { branch: conditionResult ? 'then' : 'else', nextNodeId },
      nextNodeId,
      cost: 0,
    };
  }

  private async executeActionNode(node: any, state: any) {
    const config = node.config || {};
    let output: any = {};

    if (config.actionType === 'webhook') {
      const url = interpolate(config.url || '', state);
      const body = interpolateConfig(config.body || {}, state);
      const headers = interpolateConfig(config.headers || {}, state);

      try {
        const response = await fetch(url, {
          method: config.method || 'POST',
          headers: { 'Content-Type': 'application/json', ...headers },
          body: JSON.stringify(body),
        });
        output = { status: response.status, body: await response.text() };
      } catch (err: any) {
        output = { status: 0, error: err.message };
      }
    } else if (config.actionType === 'log') {
      const message = interpolate(config.message || '', state);
      console.log(`[AGENT_LOG] ${message}`);
      output = { logged: true, message };
    }

    return { input: config, output, cost: 0 };
  }

  private findStartNode(nodes: any[]) {
    return nodes.find((n) => n.type === 'input') || nodes[0];
  }

  private findEndNode(nodes: any[]) {
    return nodes.find((n) => n.type === 'output') || nodes[nodes.length - 1];
  }
}
