import crypto from 'crypto';

export function generateApiKey(prefix = 'agent') {
  return `${prefix}_${crypto.randomBytes(24).toString('hex')}`;
}

export function generateExecutionId() {
  return `exec_${crypto.randomBytes(12).toString('hex')}`;
}

export function hashString(input: string) {
  return crypto.createHash('md5').update(input).digest('hex');
}

export function sanitizeObject(
  data: any,
  sensitiveKeys = ['password', 'apiKey', 'apiSecret', 'token', 'secret']
): any {
  if (!data || typeof data !== 'object') return data;
  const sanitized = JSON.parse(JSON.stringify(data));

  const walk = (obj: any) => {
    for (const key of Object.keys(obj)) {
      if (sensitiveKeys.some((s) => key.toLowerCase().includes(s.toLowerCase()))) {
        obj[key] = '***REDACTED***';
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        walk(obj[key]);
      }
    }
  };

  walk(sanitized);
  return sanitized;
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatCost(cost: number) {
  return `$${cost.toFixed(6)}`;
}

export function formatLatency(ms: number) {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}
