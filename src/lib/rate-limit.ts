/**
 * Trivial in-memory rate limiter for single-instance deployments.
 * For production with multiple instances use a shared store (Redis, Upstash).
 */
const hits = new Map<string, { count: number; resetAt: number }>();

interface RateLimitOptions {
  /** Unique key for the limit scope (e.g. `login:192.168.1.1`). */
  key: string;
  /** Maximum number of requests allowed within the window. */
  max: number;
  /** Window duration in seconds. */
  windowSec: number;
}

/**
 * Returns `true` when the request is within the rate limit.
 * When the limit is exceeded it returns `false`.
 *
 * Data is stored in memory and resets when the process restarts.
 */
export function checkRateLimit({ key, max, windowSec }: RateLimitOptions): boolean {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + windowSec * 1000 });
    return true;
  }

  if (entry.count >= max) return false;

  entry.count++;
  return true;
}
