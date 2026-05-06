/**
 * Interpolate {{variable}} patterns in strings using state object.
 * Supports nested paths like {{node_classify.outputs.score}}
 */
export function interpolate(template: string, state: Record<string, any>): string {
  if (typeof template !== 'string') return template;

  return template.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
    const value = resolvePath(path.trim(), state);
    if (value === undefined) return match;
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  });
}

/**
 * Resolve a dot-separated path against a state object.
 */
export function resolvePath(path: string, obj: any): any {
  const parts = path.split('.');
  let current = obj;

  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    const arrayMatch = part.match(/^(\w+)\[(\d+)\]$/);
    if (arrayMatch) {
      current = current[arrayMatch[1]];
      if (Array.isArray(current)) {
        current = current[parseInt(arrayMatch[2])];
      } else {
        return undefined;
      }
    } else {
      current = current[part];
    }
  }

  return current;
}

/**
 * Deep interpolate an entire config object/array/string
 */
export function interpolateConfig(config: any, state: Record<string, any>): any {
  if (typeof config === 'string') {
    return interpolate(config, state);
  }
  if (Array.isArray(config)) {
    return config.map((item) => interpolateConfig(item, state));
  }
  if (typeof config === 'object' && config !== null) {
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(config)) {
      result[key] = interpolateConfig(value, state);
    }
    return result;
  }
  return config;
}
