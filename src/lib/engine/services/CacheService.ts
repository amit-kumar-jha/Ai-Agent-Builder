/**
 * In-memory cache service with Redis-like API.
 */
export class CacheService {
  private store = new Map<string, { value: any; expiresAt: number | null }>();

  async get(key: string): Promise<any> {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (entry.expiresAt && entry.expiresAt < Date.now()) {
      this.store.delete(key);
      return null;
    }

    return entry.value;
  }

  async set(key: string, value: any, ttl = 3600): Promise<void> {
    const entry = {
      value,
      expiresAt: ttl > 0 ? Date.now() + ttl * 1000 : null,
    };
    this.store.set(key, entry);
  }

  async del(key: string): Promise<void> {
    this.store.delete(key);
  }

  async clear(): Promise<void> {
    this.store.clear();
  }

  getStats() {
    return {
      size: this.store.size,
      type: 'in-memory',
    };
  }
}
