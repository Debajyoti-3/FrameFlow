import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});


export const rateLimiter = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, "60 s"), // 10 requests per 60 seconds
  analytics: true,
});
