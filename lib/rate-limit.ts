import { RateLimitError } from './errors';

// In-memory rate limit store (for single-instance deployments)
// For distributed deployments, use Redis or similar
const rateLimitStore = new Map<
  string,
  { count: number; resetTime: number }
>();

export interface RateLimitOptions {
  limit: number; // Number of requests allowed
  window: number; // Time window in seconds
  keyPrefix?: string;
}

export function getRateLimitKey(identifier: string, prefix = 'api'): string {
  return `${prefix}:${identifier}`;
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions
): { allowed: boolean; remaining: number; resetTime: number } {
  const key = getRateLimitKey(identifier, options.keyPrefix);
  const now = Date.now();
  const windowMs = options.window * 1000;

  let record = rateLimitStore.get(key);

  // Reset if window has expired
  if (!record || now > record.resetTime) {
    record = { count: 0, resetTime: now + windowMs };
  }

  const remaining = Math.max(0, options.limit - record.count);
  const allowed = record.count < options.limit;

  if (allowed) {
    record.count++;
    rateLimitStore.set(key, record);
  }

  return { allowed, remaining, resetTime: record.resetTime };
}

export function enforceRateLimit(
  identifier: string,
  options: RateLimitOptions
): void {
  const { allowed, resetTime } = checkRateLimit(identifier, options);

  if (!allowed) {
    const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);
    throw new RateLimitError(retryAfter);
  }
}

// Cleanup old entries periodically
export function cleanupRateLimitStore(): void {
  const now = Date.now();
  const toDelete: string[] = [];

  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      toDelete.push(key);
    }
  }

  toDelete.forEach((key) => rateLimitStore.delete(key));
}

// Run cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
}
