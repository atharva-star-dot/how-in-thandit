/**
 * In-memory sliding-window IP rate limiter for Next.js Route Handlers
 */

interface RateLimitEntry {
  tokens: number;
  lastRefill: number;
}

const ipBuckets = new Map<string, RateLimitEntry>();

export interface RateLimitOptions {
  limit: number; // max requests
  windowMs: number; // window duration in ms
}

export function checkRateLimit(
  ip: string,
  options: RateLimitOptions = { limit: 20, windowMs: 60 * 60 * 1000 }
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = ipBuckets.get(ip) || { tokens: options.limit, lastRefill: now };

  // Refill tokens based on elapsed time
  const elapsed = now - entry.lastRefill;
  if (elapsed > options.windowMs) {
    entry.tokens = options.limit;
    entry.lastRefill = now;
  }

  if (entry.tokens > 0) {
    entry.tokens -= 1;
    ipBuckets.set(ip, entry);
    return { allowed: true, remaining: entry.tokens };
  }

  ipBuckets.set(ip, entry);
  return { allowed: false, remaining: 0 };
}
