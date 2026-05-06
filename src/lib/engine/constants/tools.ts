export interface BuiltinTool {
  name: string;
  slug: string;
  category: 'integration' | 'transformation' | 'logic' | 'communication';
  description: string;
  icon: string;
  inputs: Record<string, { type: string; required?: boolean; description?: string; default?: any; min?: number; max?: number; enum?: string[] }>;
  outputs: Record<string, { type: string; enum?: string[] }>;
  handler: (inputs: any) => any;
}

export const BUILTIN_TOOLS: Record<string, BuiltinTool> = {
  http_get: {
    name: 'HTTP GET',
    slug: 'http_get',
    category: 'integration',
    description: 'Make HTTP GET request to any URL',
    icon: '🌐',
    inputs: {
      url: { type: 'string', required: true, description: 'URL to call' },
      headers: { type: 'object', description: 'Request headers' },
      timeout: { type: 'number', default: 30, description: 'Timeout in seconds' },
    },
    outputs: {
      status: { type: 'number' },
      headers: { type: 'object' },
      body: { type: 'string' },
      error: { type: 'string' },
    },
    handler: async (inputs: any) => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), (inputs.timeout || 30) * 1000);
        const response = await fetch(inputs.url, {
          method: 'GET',
          headers: inputs.headers || {},
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        return {
          status: response.status,
          headers: Object.fromEntries(response.headers),
          body: await response.text(),
          error: null,
        };
      } catch (err: any) {
        return { status: 0, headers: {}, body: null, error: err.message };
      }
    },
  },

  http_post: {
    name: 'HTTP POST',
    slug: 'http_post',
    category: 'integration',
    description: 'Make HTTP POST request with JSON body',
    icon: '📤',
    inputs: {
      url: { type: 'string', required: true },
      body: { type: 'object', description: 'Request body (JSON)' },
      headers: { type: 'object' },
      timeout: { type: 'number', default: 30 },
    },
    outputs: {
      status: { type: 'number' },
      headers: { type: 'object' },
      body: { type: 'string' },
      error: { type: 'string' },
    },
    handler: async (inputs: any) => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), (inputs.timeout || 30) * 1000);
        const response = await fetch(inputs.url, {
          method: 'POST',
          body: JSON.stringify(inputs.body),
          headers: { 'Content-Type': 'application/json', ...(inputs.headers || {}) },
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        return {
          status: response.status,
          headers: Object.fromEntries(response.headers),
          body: await response.text(),
          error: null,
        };
      } catch (err: any) {
        return { status: 0, headers: {}, body: null, error: err.message };
      }
    },
  },

  extract_json: {
    name: 'Extract JSON',
    slug: 'extract_json',
    category: 'transformation',
    description: 'Parse and extract JSON from text',
    icon: '📋',
    inputs: {
      text: { type: 'string', required: true },
    },
    outputs: {
      data: { type: 'object' },
      error: { type: 'string' },
    },
    handler: (inputs: any) => {
      try {
        const match = inputs.text.match(/\{[\s\S]*\}/);
        if (!match) throw new Error('No JSON object found in text');
        return { data: JSON.parse(match[0]), error: null };
      } catch (err: any) {
        return { data: null, error: err.message };
      }
    },
  },

  decision: {
    name: 'Decision (If/Else)',
    slug: 'decision',
    category: 'logic',
    description: 'Branch execution based on a condition',
    icon: '🔀',
    inputs: {
      condition: { type: 'boolean', required: true },
    },
    outputs: {
      branch: { type: 'string', enum: ['true', 'false'] },
    },
    handler: (inputs: any) => {
      return { branch: inputs.condition ? 'true' : 'false' };
    },
  },

  loop: {
    name: 'Loop',
    slug: 'loop',
    category: 'logic',
    description: 'Iterate over array items',
    icon: '🔄',
    inputs: {
      items: { type: 'array', required: true },
      maxIterations: { type: 'number', default: 100 },
    },
    outputs: {
      count: { type: 'number' },
      error: { type: 'string' },
    },
    handler: (inputs: any) => {
      const count = Math.min(inputs.items.length, inputs.maxIterations || 100);
      return {
        count,
        error: count < inputs.items.length ? 'Max iterations reached' : null,
      };
    },
  },

  text_replace: {
    name: 'Text Replace',
    slug: 'text_replace',
    category: 'transformation',
    description: 'Replace text using regex pattern',
    icon: '🔤',
    inputs: {
      text: { type: 'string', required: true },
      pattern: { type: 'string', required: true },
      replacement: { type: 'string', required: true },
    },
    outputs: {
      result: { type: 'string' },
    },
    handler: (inputs: any) => {
      try {
        const regex = new RegExp(inputs.pattern, 'g');
        return { result: inputs.text.replace(regex, inputs.replacement) };
      } catch {
        return { result: inputs.text };
      }
    },
  },

  text_split: {
    name: 'Text Split',
    slug: 'text_split',
    category: 'transformation',
    description: 'Split text by delimiter',
    icon: '✂️',
    inputs: {
      text: { type: 'string', required: true },
      delimiter: { type: 'string', default: ',' },
    },
    outputs: {
      parts: { type: 'array' },
    },
    handler: (inputs: any) => {
      return { parts: inputs.text.split(inputs.delimiter || ',') };
    },
  },

  math_operation: {
    name: 'Math Operation',
    slug: 'math_operation',
    category: 'logic',
    description: 'Basic math operations (+, -, *, /, %)',
    icon: '🔢',
    inputs: {
      a: { type: 'number', required: true },
      operation: { type: 'string', enum: ['+', '-', '*', '/', '%'], required: true },
      b: { type: 'number', required: true },
    },
    outputs: {
      result: { type: 'number' },
    },
    handler: (inputs: any) => {
      const ops: Record<string, (a: number, b: number) => number> = {
        '+': (a, b) => a + b,
        '-': (a, b) => a - b,
        '*': (a, b) => a * b,
        '/': (a, b) => (b !== 0 ? a / b : 0),
        '%': (a, b) => (b !== 0 ? a % b : 0),
      };
      return { result: (ops[inputs.operation] || (() => 0))(inputs.a, inputs.b) };
    },
  },

  wait: {
    name: 'Wait',
    slug: 'wait',
    category: 'logic',
    description: 'Pause execution for N seconds (max 300)',
    icon: '⏱️',
    inputs: {
      seconds: { type: 'number', required: true, min: 0, max: 300 },
    },
    outputs: {
      waited: { type: 'boolean' },
    },
    handler: async (inputs: any) => {
      const secs = Math.min(Math.max(inputs.seconds || 0, 0), 300);
      await new Promise((r) => setTimeout(r, secs * 1000));
      return { waited: true };
    },
  },

  log: {
    name: 'Log',
    slug: 'log',
    category: 'logic',
    description: 'Log a message for debugging',
    icon: '📝',
    inputs: {
      message: { type: 'string', required: true },
      level: { type: 'string', enum: ['info', 'warn', 'error'], default: 'info' },
    },
    outputs: {
      logged: { type: 'boolean' },
    },
    handler: (inputs: any) => {
      console.log(`[AGENT_LOG][${(inputs.level || 'info').toUpperCase()}] ${inputs.message}`);
      return { logged: true };
    },
  },
};
