import { NextResponse } from 'next/server';
import { LLM_MODELS } from '@/lib/engine/constants/models';
import { LLMClient } from '@/lib/engine/services/LLMClient';
import connectDB from '@/lib/mongoose';
import Agent from '@/models/Agent';
import Conversation from '@/models/Conversation';
import { deductCredit } from '@/actions/credits';

const llm = new LLMClient();

export async function POST(req: Request) {
  try {
    const { messages, systemPrompt, model, temperature, agentId, sessionId } = await req.json();

    // Load agent to get knowledge base
    await connectDB();
    let agent: any = null;
    if (agentId) {
      // Explicitly select knowledge field and don't exclude any fields
      agent = await Agent.findById(agentId).lean();
      console.log('[RAG] Agent found:', !!agent, 'ID:', agentId);
      console.log('[RAG] Knowledge docs:', agent?.knowledge?.length || 0);
    }

    // ─── Save User Message ───
    if (agentId && sessionId && messages && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === 'user') {
        await Conversation.findOneAndUpdate(
          { agentId, sessionId },
          { 
            $push: { messages: { role: 'user', content: lastMsg.content, timestamp: new Date() } },
            $set: { updatedAt: new Date() }
          },
          { upsert: true }
        );
      }
    }

    // ─── Credit Check ───
    // Deduct 1 credit from the agent owner for each message
    const ownerId = agent?.userId || agent?.user;
    if (ownerId) {
      const creditResult = await deductCredit(ownerId.toString());
      if (!creditResult.allowed) {
        return NextResponse.json({
          error: creditResult.message || 'You have run out of credits. Please upgrade your plan or purchase a credit pack.',
          code: 'NO_CREDITS',
        }, { status: 402 }); // 402 Payment Required
      }
    }

    let finalSystemPrompt = systemPrompt || 'You are a helpful assistant.';

    // RAG: Inject knowledge base into prompt
    if (agent && agent.knowledge && agent.knowledge.length > 0) {
      console.log('[RAG] Injecting', agent.knowledge.length, 'documents into system prompt');
      
      // Build knowledge context
      let knowledgeContext = '';
      agent.knowledge.forEach((doc: any) => {
        console.log('[RAG] Document:', doc.fileName, 'Content length:', doc.content?.length || 0);
        if (doc.content) {
          knowledgeContext += `### Document: ${doc.fileName}\n${doc.content}\n\n`;
        }
      });

      if (knowledgeContext.length > 0) {
        // Prepend knowledge as the HIGHEST priority context using XML tags
        finalSystemPrompt = `You are an expert AI assistant. You have been provided with a knowledge base containing reference documents. 
You MUST prioritize this knowledge base when answering. If the user's question relates to the documents, you must extract the answer from them.

<knowledge_base>
${knowledgeContext}
</knowledge_base>

User's custom instructions for your persona:
${finalSystemPrompt}`;
      }
    } else {
      console.log('[RAG] No knowledge base found for agent', agentId);
    }

    // Prepare the full conversation history including the system prompt
    const fullMessages = [
      { role: 'system', content: finalSystemPrompt },
      ...messages,
    ];

    // Look up the model config
    const modelConfig = LLM_MODELS[model];

    if (!modelConfig) {
      // Fallback: try as a raw Ollama model name
      if (model && (model.startsWith('llama') || model.startsWith('mistral') || model.startsWith('gemma') || model.startsWith('phi') || model.startsWith('qwen'))) {
        try {
          const ollamaUrl = process.env.OLLAMA_URL || 'http://127.0.0.1:11434';
          const ollamaResponse = await fetch(`${ollamaUrl}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model,
              messages: fullMessages,
              stream: false,
              options: { 
                temperature: temperature || 0.7,
                num_ctx: 32768 // Need large context for RAG
              },
            }),
          });

          if (!ollamaResponse.ok) {
            const errData = await ollamaResponse.text();
            throw new Error(`Ollama Error: ${errData || ollamaResponse.statusText}`);
          }

          const data = await ollamaResponse.json();

          // Track execution on agent
          await trackExecution(agentId, true, 0);

          // Save AI Response to Conversation
          if (agentId && sessionId) {
            await Conversation.findOneAndUpdate(
              { agentId, sessionId },
              { 
                $push: { messages: { role: 'assistant', content: data.message.content, timestamp: new Date() } },
                $set: { updatedAt: new Date() }
              }
            );
          }

          return NextResponse.json({ content: data.message.content });
        } catch (error: any) {
          await trackExecution(agentId, false, 0);
          return NextResponse.json({
            error: error.message.includes('Ollama Error')
              ? error.message
              : `Cannot connect to Ollama. Make sure it's installed and running: ollama run ${model}`,
          }, { status: 500 });
        }
      }

      return NextResponse.json({
        error: `Unknown model: ${model}. Please select a model from the available list.`,
      }, { status: 400 });
    }

    // Use the unified LLM client
    try {
      const result = await llm.chat({
        model,
        messages: fullMessages,
        temperature: temperature || 0.7,
        maxTokens: 2000,
      });

      // Calculate cost based on token usage
      let cost = 0;
      if (result.usage && modelConfig.costPerMillionInput > 0) {
        cost = ((result.usage.prompt_tokens || 0) * modelConfig.costPerMillionInput / 1_000_000)
             + ((result.usage.completion_tokens || 0) * modelConfig.costPerMillionOutput / 1_000_000);
      }

      // Track execution on agent
      await trackExecution(agentId, true, cost);

      // Save AI Response to Conversation
      if (agentId && sessionId) {
        await Conversation.findOneAndUpdate(
          { agentId, sessionId },
          { 
            $push: { messages: { role: 'assistant', content: result.text, timestamp: new Date() } },
            $set: { updatedAt: new Date() }
          }
        );
      }

      return NextResponse.json({
        content: result.text,
        model: result.model || model,
        usage: result.usage,
      });
    } catch (error: any) {
      console.error(`Chat error [${modelConfig.provider}]:`, error.message);

      await trackExecution(agentId, false, 0);

      // Provider-specific error messages
      if (modelConfig.provider === 'openrouter' && error.message.includes('no API key')) {
        return NextResponse.json({
          error: 'OpenRouter API key not configured. Get a free key at https://openrouter.ai/keys and add OPENROUTER_API_KEY to your .env.local file.',
        }, { status: 400 });
      }

      if (modelConfig.provider === 'ollama' && error.message.includes('Cannot connect')) {
        return NextResponse.json({
          error: `Ollama is not running. Install it from https://ollama.com and run: ollama run ${modelConfig.modelId}`,
        }, { status: 500 });
      }

      return NextResponse.json({ error: error.message }, { status: 500 });
    }

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/** Track execution stats on the agent (non-blocking) */
async function trackExecution(agentId: string | undefined, success: boolean, cost: number) {
  if (!agentId) return;
  try {
    await connectDB();
    const update: any = {
      $inc: {
        'stats.totalExecutions': 1,
        ...(success ? { 'stats.successCount': 1 } : { 'stats.errorCount': 1 }),
        ...(cost > 0 ? { 'stats.costToDate': cost } : {}),
      },
      $set: { 'stats.lastExecutedAt': new Date() },
    };
    await Agent.findByIdAndUpdate(agentId, update);
  } catch (e) {
    // Non-blocking — don't fail the response if tracking fails
    console.error('Failed to track execution:', e);
  }
}
