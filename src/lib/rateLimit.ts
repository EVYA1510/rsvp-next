// Rate limiting utility for API endpoints
const requests = new Map<string, number[]>();

export function checkRateLimit(
  ip: string, 
  limit: number = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "5"), 
  windowMs: number = parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000")
): boolean {
  const now = Date.now();
  const timestamps = requests.get(ip) || [];
  
  // Remove old timestamps outside the window
  const recent = timestamps.filter(time => now - time < windowMs);
  
  if (recent.length >= limit) {
    return false;
  }
  
  // Add current timestamp
  recent.push(now);
  requests.set(ip, recent);
  
  // Clean up old entries to prevent memory leaks
  if (requests.size > 1000) {
    const oldestKey = requests.keys().next().value;
    if (oldestKey) {
      requests.delete(oldestKey);
    }
  }
  
  return true;
}

// Get current rate limit status for an IP
export function getRateLimitStatus(ip: string): {
  remaining: number;
  resetTime: number;
  limit: number;
} {
  const now = Date.now();
  const timestamps = requests.get(ip) || [];
  const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000");
  const limit = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "5");
  
  const recent = timestamps.filter(time => now - time < windowMs);
  const remaining = Math.max(0, limit - recent.length);
  const resetTime = recent.length > 0 ? recent[0] + windowMs : now;
  
  return {
    remaining,
    resetTime,
    limit,
  };
}
