import { LLM_MODELS } from '../constants/models';

export class LLMClient {
  private openaiKey: string;
  private anthropicKey: string;
  private openrouterKey: string;

  constructor() {
    this.openaiKey = process.env.OPENAI_API_KEY || '';
    this.anthropicKey = process.env.ANTHROPIC_API_KEY || '';
    this.openrouterKey = process.env.OPENROUTER_API_KEY || '';
  }

  async chat({ model = 'openrouter/auto', messages, tools, temperature = 0.7, maxTokens = 1000 }: {
    model?: string;
    messages: { role: string; content: string }[];
    tools?: any[];
    temperature?: number;
    maxTokens?: number;
  }) {
    const modelConfig = LLM_MODELS[model];
    if (!modelConfig) throw new Error(`Unsupported model: ${model}`);

    switch (modelConfig.provider) {
      case 'openrouter':
        return this.callOpenRouter({ model: modelConfig.modelId, messages, tools, temperature, maxTokens });
      case 'ollama':
        return this.callOllama({ model: modelConfig.modelId, messages, temperature });
      case 'openai':
        return this.callOpenAI({ model: modelConfig.modelId, messages, tools, temperature, maxTokens });
      case 'anthropic':
        return this.callAnthropic({ model: modelConfig.modelId, messages, tools, temperature, maxTokens });
      default:
        throw new Error(`Unknown provider: ${modelConfig.provider}`);
    }
  }

  // ========================
  // OpenRouter (Free + Paid models)
  // ========================
  private async callOpenRouter({ model, messages, tools, temperature, maxTokens }: any) {
    if (!this.openrouterKey) {
      return this.mockResponse(messages, model, 'OpenRouter');
    }

    const body: any = {
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    };

    if (tools && tools.length > 0) {
      body.tools = tools.map((t: any) => ({
        type: 'function',
        function: { name: t.name, description: t.description, parameters: t.schema },
      }));
    }

    const response = await this.fetchWithRetry('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openrouterKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'NexAgeAI',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(`OpenRouter error: ${data.error.message || JSON.stringify(data.error)}`);
    }

    const choice = data.choices?.[0];
    if (!choice) {
      throw new Error('OpenRouter returned no choices');
    }

    const result: any = {
      text: choice.message?.content || '',
      toolCalls: null,
      usage: data.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
      model: data.model, // Actual model used (useful for openrouter/auto)
    };

    if (choice.message?.tool_calls) {
      result.toolCalls = choice.message.tool_calls.map((tc: any) => ({
        id: tc.id,
        name: tc.function.name,
        args: JSON.parse(tc.function.arguments),
      }));
    }

    return result;
  }

  // ========================
  // Ollama (Local, offline, free)
  // ========================
  private async callOllama({ model, messages, temperature }: any) {
    const ollamaUrl = process.env.OLLAMA_URL || 'http://127.0.0.1:11434';

    try {
      const response = await fetch(`${ollamaUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          messages,
          stream: false,
          options: { 
            temperature: temperature || 0.7,
            num_ctx: 32768 // Required for RAG with large documents
          },
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Ollama error: ${errText || response.statusText}`);
      }

      const data = await response.json();

      return {
        text: data.message?.content || '',
        toolCalls: null,
        usage: {
          prompt_tokens: data.prompt_eval_count || 0,
          completion_tokens: data.eval_count || 0,
          total_tokens: (data.prompt_eval_count || 0) + (data.eval_count || 0),
        },
        model,
      };
    } catch (err: any) {
      if (err.message.includes('Ollama error')) throw err;
      throw new Error(
        `Cannot connect to Ollama at ${ollamaUrl}. Make sure Ollama is installed and running (ollama run ${model}).`
      );
    }
  }

  // ========================
  // OpenAI (Paid)
  // ========================
  private async callOpenAI({ model, messages, tools, temperature, maxTokens }: any) {
    if (!this.openaiKey) {
      return this.mockResponse(messages, model, 'OpenAI');
    }

    const body: any = { model, messages, temperature, max_tokens: maxTokens };

    if (tools && tools.length > 0) {
      body.tools = tools.map((t: any) => ({
        type: 'function',
        function: { name: t.name, description: t.description, parameters: t.schema },
      }));
    }

    const response = await this.fetchWithRetry('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.openaiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (data.error) throw new Error(`OpenAI error: ${data.error.message}`);

    const choice = data.choices[0];
    const result: any = { text: choice.message.content || '', toolCalls: null, usage: data.usage };

    if (choice.message.tool_calls) {
      result.toolCalls = choice.message.tool_calls.map((tc: any) => ({
        id: tc.id, name: tc.function.name, args: JSON.parse(tc.function.arguments),
      }));
    }

    return result;
  }

  // ========================
  // Anthropic (Paid)
  // ========================
  private async callAnthropic({ model, messages, tools, temperature, maxTokens }: any) {
    if (!this.anthropicKey) {
      return this.mockResponse(messages, model, 'Anthropic');
    }

    const systemMsg = messages.find((m: any) => m.role === 'system');
    const userMessages = messages.filter((m: any) => m.role !== 'system');

    const body: any = {
      model,
      max_tokens: maxTokens,
      temperature,
      messages: userMessages.map((m: any) => ({ role: m.role, content: m.content })),
    };

    if (systemMsg) body.system = systemMsg.content;
    if (tools && tools.length > 0) {
      body.tools = tools.map((t: any) => ({
        name: t.name, description: t.description, input_schema: t.schema,
      }));
    }

    const response = await this.fetchWithRetry('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': this.anthropicKey, 'Content-Type': 'application/json', 'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (data.error) throw new Error(`Anthropic error: ${data.error.message}`);

    const textBlock = data.content.find((b: any) => b.type === 'text');
    const toolUseBlocks = data.content.filter((b: any) => b.type === 'tool_use');

    return {
      text: textBlock?.text || '',
      toolCalls: toolUseBlocks.length > 0
        ? toolUseBlocks.map((b: any) => ({ id: b.id, name: b.name, args: b.input }))
        : null,
      usage: data.usage,
    };
  }

  // ========================
  // Mock response (when no API key)
  // ========================
  private mockResponse(messages: any[], model: string, provider: string) {
    const lastMessage = messages[messages.length - 1];
    return {
      text: `[Mock ${provider} response — no API key configured]\n\nModel: ${model}\nInput: "${(lastMessage?.content || '').substring(0, 120)}..."\n\nTo get real responses, add your API key in .env.local:\n• OPENROUTER_API_KEY (free models)\n• OPENAI_API_KEY (GPT models)\n• ANTHROPIC_API_KEY (Claude models)`,
      toolCalls: null,
      usage: { prompt_tokens: 50, completion_tokens: 30, total_tokens: 80 },
      model,
    };
  }

  // ========================
  // Fetch with retry + rate limit handling
  // ========================
  private async fetchWithRetry(url: string, options: any, maxRetries = 3): Promise<Response> {
    let lastError: any;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch(url, options);
        if (response.status === 429) {
          const retryAfter = parseInt(response.headers.get('retry-after') || '5');
          console.warn(`Rate limited, retrying in ${retryAfter}s (attempt ${attempt + 1})`);
          await new Promise((r) => setTimeout(r, retryAfter * 1000));
          continue;
        }
        return response;
      } catch (err) {
        lastError = err;
        console.warn(`LLM request failed (attempt ${attempt + 1}): ${(err as Error).message}`);
        await new Promise((r) => setTimeout(r, Math.pow(2, attempt) * 1000));
      }
    }
    throw lastError || new Error('LLM request failed after retries');
  }
}
