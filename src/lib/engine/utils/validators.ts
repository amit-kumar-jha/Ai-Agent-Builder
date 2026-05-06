import { ValidationError } from './errors';

export function validateRequired(fields: string[], body: Record<string, any>) {
  const missing = fields.filter((f) => !body[f] && body[f] !== 0 && body[f] !== false);
  if (missing.length > 0) {
    throw new ValidationError(`Missing required fields: ${missing.join(', ')}`);
  }
}

export function validateStringLength(value: any, field: string, min = 1, max = 255) {
  if (typeof value !== 'string') {
    throw new ValidationError(`${field} must be a string`);
  }
  if (value.length < min || value.length > max) {
    throw new ValidationError(`${field} must be ${min}-${max} characters`);
  }
}

export function validateEmail(email: string) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) {
    throw new ValidationError('Invalid email address');
  }
}

export function validatePassword(password: string) {
  if (!password || password.length < 8) {
    throw new ValidationError('Password must be at least 8 characters');
  }
}

export function validateObjectId(id: string) {
  const re = /^[0-9a-fA-F]{24}$/;
  if (!re.test(id)) {
    throw new ValidationError('Invalid ID format');
  }
}

export function validateWorkflow(workflow: any) {
  if (!workflow || !workflow.nodes || !Array.isArray(workflow.nodes)) {
    throw new ValidationError('Workflow must have a nodes array');
  }
  if (!workflow.connections || !Array.isArray(workflow.connections)) {
    throw new ValidationError('Workflow must have a connections array');
  }
  for (const node of workflow.nodes) {
    if (!node.id || !node.type) {
      throw new ValidationError('Each node must have an id and type');
    }
  }
}
