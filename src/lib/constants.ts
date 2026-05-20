export const NODE_TYPES = [
  { type: 'input', label: 'Input', icon: '📥', category: 'flow', color: '#3B82F6', description: 'Start node — define input schema' },
  { type: 'llm', label: 'LLM', icon: '🧠', category: 'ai', color: '#8B5CF6', description: 'Call AI model (GPT-4, Claude)' },
  { type: 'decision', label: 'Decision', icon: '🔀', category: 'logic', color: '#F59E0B', description: 'If/else branching' },
  { type: 'action', label: 'Action', icon: '⚡', category: 'integration', color: '#06B6D4', description: 'Webhook, email, or log' },
  { type: 'tool', label: 'Tool', icon: '🔧', category: 'integration', color: '#10B981', description: 'Run a built-in tool' },
  { type: 'output', label: 'Output', icon: '📤', category: 'flow', color: '#EF4444', description: 'End node — define output' },
];

export const LLM_MODELS = [
  { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI', cost: '$30/M tokens' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI', cost: '$10/M tokens' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI', cost: '$0.50/M tokens' },
  { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic', cost: '$15/M tokens' },
  { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic', cost: '$3/M tokens' },
  { id: 'claude-3-haiku', name: 'Claude 3 Haiku', provider: 'Anthropic', cost: '$0.25/M tokens' },
];

export const AGENT_TEMPLATES = [
  {
    id: 'blank',
    name: 'Blank Agent',
    icon: '📄',
    description: 'Start from scratch with a clean canvas',
    workflow: {
      nodes: [
        { id: 'node_input', type: 'input', label: 'Input', position: { x: 250, y: 50 }, config: { schema: { text: { type: 'string' } } } },
        { id: 'node_output', type: 'output', label: 'Output', position: { x: 250, y: 200 }, config: { outputSchema: { result: '{{node_input.outputs.text}}' } } },
      ],
      connections: [{ from: 'node_input', to: 'node_output' }],
    },
  },
  {
    id: 'chatbot',
    name: 'AI Chatbot',
    icon: '💬',
    description: 'Simple LLM-powered chatbot with custom prompt',
    workflow: {
      nodes: [
        { id: 'node_input', type: 'input', label: 'User Message', position: { x: 250, y: 50 }, config: { schema: { message: { type: 'string' } } } },
        { id: 'node_llm', type: 'llm', label: 'AI Response', position: { x: 250, y: 200 }, config: { model: 'gpt-4', prompt: '{{message}}', systemPrompt: 'You are a helpful AI assistant.', temperature: 0.7, maxTokens: 1000 } },
        { id: 'node_output', type: 'output', label: 'Response', position: { x: 250, y: 350 }, config: { outputSchema: { response: '{{node_llm.outputs}}' } } },
      ],
      connections: [{ from: 'node_input', to: 'node_llm' }, { from: 'node_llm', to: 'node_output' }],
    },
  },
  {
    id: 'classifier',
    name: 'Content Classifier',
    icon: '🏷️',
    description: 'Classify content with LLM and route based on results',
    workflow: {
      nodes: [
        { id: 'node_input', type: 'input', label: 'Content Input', position: { x: 250, y: 50 }, config: { schema: { content: { type: 'string' }, categories: { type: 'string' } } } },
        { id: 'node_classify', type: 'llm', label: 'Classify Content', position: { x: 250, y: 200 }, config: { model: 'gpt-4', prompt: 'Classify this content into one of these categories: {{categories}}\n\nContent:\n{{content}}\n\nRespond in JSON: {"category": "...", "confidence": 0.0-1.0}', temperature: 0, maxTokens: 200 } },
        { id: 'node_output', type: 'output', label: 'Classification', position: { x: 250, y: 350 }, config: { outputSchema: { result: '{{node_classify.outputs}}' } } },
      ],
      connections: [{ from: 'node_input', to: 'node_classify' }, { from: 'node_classify', to: 'node_output' }],
    },
  },
  {
    id: 'data_pipeline',
    name: 'Data Pipeline',
    icon: '🔄',
    description: 'Fetch data, transform with AI, and send webhook',
    workflow: {
      nodes: [
        { id: 'node_input', type: 'input', label: 'Pipeline Input', position: { x: 250, y: 50 }, config: { schema: { url: { type: 'string' }, prompt: { type: 'string' } } } },
        { id: 'node_fetch', type: 'action', label: 'Fetch Data', position: { x: 250, y: 180 }, config: { actionType: 'webhook', url: '{{url}}', method: 'GET' } },
        { id: 'node_process', type: 'llm', label: 'Process Data', position: { x: 250, y: 310 }, config: { model: 'gpt-3.5-turbo', prompt: '{{prompt}}\n\nData:\n{{node_fetch.outputs.body}}', temperature: 0, maxTokens: 2000 } },
        { id: 'node_output', type: 'output', label: 'Result', position: { x: 250, y: 440 }, config: { outputSchema: { processed: '{{node_process.outputs}}' } } },
      ],
      connections: [{ from: 'node_input', to: 'node_fetch' }, { from: 'node_fetch', to: 'node_process' }, { from: 'node_process', to: 'node_output' }],
    },
  },
];

export const STATUS_COLORS: Record<string, string> = {
  draft: 'amber',
  published: 'green',
  archived: 'gray',
  running: 'cyan',
  completed: 'green',
  failed: 'red',
  cancelled: 'gray',
};

// ─── Plan Credit Limits ───
export const PLAN_CREDITS: Record<string, number> = {
  free: 100,
  starter: 1000,
  pro: 10000,
  enterprise: 999999,
};

// ─── Credit Packs (purchasable) ───
export const CREDIT_PACKS = [
  { id: 'pack_500', credits: 500, price: 500, label: '500 Credits', priceLabel: '$5' },
  { id: 'pack_2500', credits: 2500, price: 2000, label: '2,500 Credits', priceLabel: '$20' },
  { id: 'pack_7500', credits: 7500, price: 5000, label: '7,500 Credits', priceLabel: '$50' },
];
