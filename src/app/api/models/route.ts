import { NextResponse } from 'next/server';
import { LLM_MODELS, getModelsByCategory, getFreeModels } from '@/lib/engine/constants/models';

// GET /api/models — List all available LLM models
export async function GET(req: Request) {
  const url = new URL(req.url);
  const category = url.searchParams.get('category'); // 'free' | 'local' | 'premium' | null
  const freeOnly = url.searchParams.get('free') === 'true';

  let models;

  if (freeOnly) {
    models = getFreeModels();
  } else if (category === 'free' || category === 'local' || category === 'premium') {
    models = getModelsByCategory(category);
  } else {
    // Return all, grouped by category
    models = Object.entries(LLM_MODELS).map(([id, m]) => ({ id, ...m }));
  }

  // Check which providers have API keys configured
  const providers = {
    openrouter: !!process.env.OPENROUTER_API_KEY,
    ollama: true, // Always available (user just needs Ollama running)
    openai: !!process.env.OPENAI_API_KEY,
    anthropic: !!process.env.ANTHROPIC_API_KEY,
  };

  return NextResponse.json({
    success: true,
    count: models.length,
    providers,
    data: models,
  });
}
