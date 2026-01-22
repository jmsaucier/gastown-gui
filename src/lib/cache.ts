/**
 * Server-side Cache Utilities
 * Simple in-memory cache with TTL
 */

interface CacheEntry<T> {
  data: T;
  expires: number;
}

const cache = new Map<string, CacheEntry<any>>();

export const CACHE_TTL = {
  status: 5000,       // 5 seconds for status (frequently changing)
  convoys: 10000,     // 10 seconds for convoys
  mail: 15000,        // 15 seconds for mail list
  agents: 15000,      // 15 seconds for agents
  rigs: 30000,        // 30 seconds for rigs (rarely changes)
  formulas: 60000,    // 1 minute for formulas (rarely changes)
  github_prs: 30000,  // 30 seconds for GitHub PRs
  github_issues: 30000, // 30 seconds for GitHub issues
  doctor: 30000,      // 30 seconds for doctor
  rig_config: 300000, // 5 minutes for rig configs
};

/**
 * Get cached value
 */
export function getCache<T>(key: string): T | null {
  const entry = cache.get(key);
  
  if (entry && Date.now() < entry.expires) {
    return entry.data;
  }
  
  cache.delete(key);
  return null;
}

/**
 * Set cached value with TTL
 */
export function setCache<T>(key: string, data: T, ttl: number): void {
  cache.set(key, {
    data,
    expires: Date.now() + ttl,
  });
}

/**
 * Delete cached value
 */
export function deleteCache(key: string): void {
  cache.delete(key);
}

/**
 * Clear all cache
 */
export function clearCache(): void {
  cache.clear();
}

/**
 * Invalidate cache by prefix
 */
export function invalidateCachePrefix(prefix: string): void {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      cache.delete(key);
    }
  }
}

// Pending requests map - prevents duplicate concurrent requests for same data
const pendingRequests = new Map<string, Promise<any>>();

/**
 * Get cached data or execute function with deduplication
 * Prevents duplicate concurrent requests for the same key
 */
export async function getCachedOrExecute<T>(
  key: string,
  executor: () => Promise<T>,
  ttl?: number
): Promise<T> {
  // Return cached data if available
  const cached = getCache<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Return existing pending request if one is in flight
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key);
  }

  // Execute and store promise
  const promise = executor()
    .then((data) => {
      if (ttl) {
        setCache(key, data, ttl);
      }
      return data;
    })
    .finally(() => {
      pendingRequests.delete(key);
    });

  pendingRequests.set(key, promise);
  return promise;
}

// Cache cleanup interval - removes expired entries to prevent memory leaks
const CACHE_CLEANUP_INTERVAL = 60000; // 1 minute

if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [key, entry] of cache.entries()) {
      if (now >= entry.expires) {
        cache.delete(key);
        cleaned++;
      }
    }
    
    if (cleaned > 0) {
      console.log(`[Cache] Cleaned ${cleaned} expired entries, ${cache.size} remaining`);
    }
  }, CACHE_CLEANUP_INTERVAL);
}
