import { BUILTIN_TOOLS } from '../constants/tools';
import { ValidationError } from '../utils/errors';

export class ToolExecutor {
  private tools = BUILTIN_TOOLS;

  async execute(toolSlug: string, inputs: any): Promise<any> {
    const tool = this.tools[toolSlug];
    if (!tool) {
      throw new ValidationError(`Unknown tool: ${toolSlug}`);
    }

    this.validateInputs(tool, inputs);

    try {
      const result = await tool.handler(inputs);
      return result;
    } catch (err: any) {
      return { error: err.message };
    }
  }

  private validateInputs(tool: any, inputs: any) {
    if (!tool.inputs) return;

    for (const [key, schema] of Object.entries(tool.inputs) as any[]) {
      if (schema.required && (inputs[key] === undefined || inputs[key] === null)) {
        throw new ValidationError(`Missing required input: ${key} for tool ${tool.name}`);
      }

      if (inputs[key] !== undefined && inputs[key] !== null) {
        if (schema.type === 'string' && typeof inputs[key] !== 'string') {
          throw new ValidationError(`Input ${key} must be a string`);
        }
        if (schema.type === 'number' && typeof inputs[key] !== 'number') {
          throw new ValidationError(`Input ${key} must be a number`);
        }
        if (schema.type === 'boolean' && typeof inputs[key] !== 'boolean') {
          throw new ValidationError(`Input ${key} must be a boolean`);
        }
        if (schema.type === 'array' && !Array.isArray(inputs[key])) {
          throw new ValidationError(`Input ${key} must be an array`);
        }
        if (schema.min !== undefined && inputs[key] < schema.min) {
          throw new ValidationError(`Input ${key} must be >= ${schema.min}`);
        }
        if (schema.max !== undefined && inputs[key] > schema.max) {
          throw new ValidationError(`Input ${key} must be <= ${schema.max}`);
        }
      }
    }
  }

  listTools() {
    return Object.entries(this.tools).map(([slug, tool]) => ({
      slug,
      name: tool.name,
      category: tool.category,
      description: tool.description,
      icon: tool.icon,
      inputs: tool.inputs,
      outputs: tool.outputs,
    }));
  }

  getTool(slug: string) {
    const tool = this.tools[slug];
    if (!tool) return null;
    return {
      slug,
      name: tool.name,
      category: tool.category,
      description: tool.description,
      icon: tool.icon,
      inputs: tool.inputs,
      outputs: tool.outputs,
    };
  }
}
