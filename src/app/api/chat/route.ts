import { NextResponse } from 'next/server';
import { LLM_MODELS } from '@/lib/engine/constants/models';
import { LLMClient } from '@/lib/engine/services/LLMClient';

const llm = new LLMClient();

export async function POST(req: Request) {
  try {
    const { messages, systemPrompt, model, temperature } = await req.json();

    // Prepare the full conversation history including the system prompt
    const fullMessages = [
      { role: 'system', content: systemPrompt || 'You are a helpful assistant.' },
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
              options: { temperature: temperature || 0.7 },
            }),
          });

          if (!ollamaResponse.ok) {
            const errData = await ollamaResponse.text();
            throw new Error(`Ollama Error: ${errData || ollamaResponse.statusText}`);
          }

          const data = await ollamaResponse.json();
          return NextResponse.json({ content: data.message.content });
        } catch (error: any) {
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

      return NextResponse.json({
        content: result.text,
        model: result.model || model,
        usage: result.usage,
      });
    } catch (error: any) {
      console.error(`Chat error [${modelConfig.provider}]:`, error.message);

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
