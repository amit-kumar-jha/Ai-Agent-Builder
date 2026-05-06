export interface LLMModel {
  name: string;
  provider: 'openai' | 'anthropic' | 'openrouter' | 'ollama';
  modelId: string; // The actual model ID sent to the provider API
  maxTokens: number;
  costPerMillionInput: number;
  costPerMillionOutput: number;
  supportsFunctions: boolean;
  supportsStreaming: boolean;
  free: boolean;
  category: 'free' | 'local' | 'premium';
  description: string;
}

export const LLM_MODELS: Record<string, LLMModel> = {

  // ========================
  // 🆓 FREE via OpenRouter
  // ========================
  'google/gemma-3-12b-it:free': {
    name: 'Gemma 3 12B',
    provider: 'openrouter',
    modelId: 'google/gemma-3-12b-it:free',
    maxTokens: 32768,
    costPerMillionInput: 0,
    costPerMillionOutput: 0,
    supportsFunctions: false,
    supportsStreaming: true,
    free: true,
    category: 'free',
    description: 'Google Gemma 3 — 12B parameters, free tier',
  },
  'meta-llama/llama-4-scout:free': {
    name: 'Llama 4 Scout',
    provider: 'openrouter',
    modelId: 'meta-llama/llama-4-scout:free',
    maxTokens: 131072,
    costPerMillionInput: 0,
    costPerMillionOutput: 0,
    supportsFunctions: false,
    supportsStreaming: true,
    free: true,
    category: 'free',
    description: 'Meta Llama 4 Scout — fast & capable, free tier',
  },
  'mistralai/mistral-small-3.1-24b-instruct:free': {
    name: 'Mistral Small 3.1 24B',
    provider: 'openrouter',
    modelId: 'mistralai/mistral-small-3.1-24b-instruct:free',
    maxTokens: 96000,
    costPerMillionInput: 0,
    costPerMillionOutput: 0,
    supportsFunctions: true,
    supportsStreaming: true,
    free: true,
    category: 'free',
    description: 'Mistral Small 3.1 — strong reasoning, free tier',
  },
  'qwen/qwen3-32b:free': {
    name: 'Qwen 3 32B',
    provider: 'openrouter',
    modelId: 'qwen/qwen3-32b:free',
    maxTokens: 40960,
    costPerMillionInput: 0,
    costPerMillionOutput: 0,
    supportsFunctions: true,
    supportsStreaming: true,
    free: true,
    category: 'free',
    description: 'Alibaba Qwen 3 — 32B multilingual, free tier',
  },
  'deepseek/deepseek-r1-0528:free': {
    name: 'DeepSeek R1',
    provider: 'openrouter',
    modelId: 'deepseek/deepseek-r1-0528:free',
    maxTokens: 128000,
    costPerMillionInput: 0,
    costPerMillionOutput: 0,
    supportsFunctions: false,
    supportsStreaming: true,
    free: true,
    category: 'free',
    description: 'DeepSeek R1 — strong reasoning model, free tier',
  },
  'nvidia/llama-3.1-nemotron-ultra-253b-v1:free': {
    name: 'Nemotron Ultra 253B',
    provider: 'openrouter',
    modelId: 'nvidia/llama-3.1-nemotron-ultra-253b-v1:free',
    maxTokens: 131072,
    costPerMillionInput: 0,
    costPerMillionOutput: 0,
    supportsFunctions: true,
    supportsStreaming: true,
    free: true,
    category: 'free',
    description: 'NVIDIA Nemotron Ultra — 253B flagship, free tier',
  },
  'openrouter/auto': {
    name: 'Auto (Best Free)',
    provider: 'openrouter',
    modelId: 'openrouter/auto',
    maxTokens: 128000,
    costPerMillionInput: 0,
    costPerMillionOutput: 0,
    supportsFunctions: true,
    supportsStreaming: true,
    free: true,
    category: 'free',
    description: 'OpenRouter auto-picks the best available free model',
  },

  // ========================
  // 🖥️ LOCAL via Ollama (Free, offline)
  // ========================
  'llama3.2': {
    name: 'Llama 3.2 (Local)',
    provider: 'ollama',
    modelId: 'llama3.2',
    maxTokens: 131072,
    costPerMillionInput: 0,
    costPerMillionOutput: 0,
    supportsFunctions: false,
    supportsStreaming: true,
    free: true,
    category: 'local',
    description: 'Meta Llama 3.2 via local Ollama — runs offline, no API key needed',
  },
  'llama3': {
    name: 'Llama 3 (Local)',
    provider: 'ollama',
    modelId: 'llama3',
    maxTokens: 8192,
    costPerMillionInput: 0,
    costPerMillionOutput: 0,
    supportsFunctions: false,
    supportsStreaming: true,
    free: true,
    category: 'local',
    description: 'Meta Llama 3 via local Ollama — runs offline',
  },
  'mistral': {
    name: 'Mistral 7B (Local)',
    provider: 'ollama',
    modelId: 'mistral',
    maxTokens: 32768,
    costPerMillionInput: 0,
    costPerMillionOutput: 0,
    supportsFunctions: false,
    supportsStreaming: true,
    free: true,
    category: 'local',
    description: 'Mistral 7B via local Ollama — lightweight & fast',
  },
  'gemma2': {
    name: 'Gemma 2 (Local)',
    provider: 'ollama',
    modelId: 'gemma2',
    maxTokens: 8192,
    costPerMillionInput: 0,
    costPerMillionOutput: 0,
    supportsFunctions: false,
    supportsStreaming: true,
    free: true,
    category: 'local',
    description: 'Google Gemma 2 via local Ollama',
  },

  // ========================
  // 💎 PREMIUM (Paid API keys)
  // ========================
  'gpt-4': {
    name: 'GPT-4',
    provider: 'openai',
    modelId: 'gpt-4',
    maxTokens: 8192,
    costPerMillionInput: 30.0,
    costPerMillionOutput: 60.0,
    supportsFunctions: true,
    supportsStreaming: true,
    free: false,
    category: 'premium',
    description: 'OpenAI GPT-4 — requires OPENAI_API_KEY',
  },
  'gpt-4-turbo': {
    name: 'GPT-4 Turbo',
    provider: 'openai',
    modelId: 'gpt-4-turbo',
    maxTokens: 128000,
    costPerMillionInput: 10.0,
    costPerMillionOutput: 30.0,
    supportsFunctions: true,
    supportsStreaming: true,
    free: false,
    category: 'premium',
    description: 'OpenAI GPT-4 Turbo — faster, larger context',
  },
  'gpt-3.5-turbo': {
    name: 'GPT-3.5 Turbo',
    provider: 'openai',
    modelId: 'gpt-3.5-turbo',
    maxTokens: 16385,
    costPerMillionInput: 0.5,
    costPerMillionOutput: 1.5,
    supportsFunctions: true,
    supportsStreaming: true,
    free: false,
    category: 'premium',
    description: 'OpenAI GPT-3.5 — affordable, fast',
  },
  'claude-3-opus': {
    name: 'Claude 3 Opus',
    provider: 'anthropic',
    modelId: 'claude-3-opus-20240229',
    maxTokens: 200000,
    costPerMillionInput: 15.0,
    costPerMillionOutput: 75.0,
    supportsFunctions: true,
    supportsStreaming: true,
    free: false,
    category: 'premium',
    description: 'Anthropic Claude 3 Opus — most capable',
  },
  'claude-3-sonnet': {
    name: 'Claude 3 Sonnet',
    provider: 'anthropic',
    modelId: 'claude-3-sonnet-20240229',
    maxTokens: 200000,
    costPerMillionInput: 3.0,
    costPerMillionOutput: 15.0,
    supportsFunctions: true,
    supportsStreaming: true,
    free: false,
    category: 'premium',
    description: 'Anthropic Claude 3 Sonnet — balanced',
  },
  'claude-3-haiku': {
    name: 'Claude 3 Haiku',
    provider: 'anthropic',
    modelId: 'claude-3-haiku-20240307',
    maxTokens: 200000,
    costPerMillionInput: 0.25,
    costPerMillionOutput: 1.25,
    supportsFunctions: true,
    supportsStreaming: true,
    free: false,
    category: 'premium',
    description: 'Anthropic Claude 3 Haiku — fastest & cheapest',
  },
};

// Helper to get models by category
export function getModelsByCategory(category: 'free' | 'local' | 'premium') {
  return Object.entries(LLM_MODELS)
    .filter(([, m]) => m.category === category)
    .map(([id, m]) => ({ id, ...m }));
}

// Helper to get all free models (OpenRouter + Ollama)
export function getFreeModels() {
  return Object.entries(LLM_MODELS)
    .filter(([, m]) => m.free)
    .map(([id, m]) => ({ id, ...m }));
}
