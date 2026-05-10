import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const authLimiter = new Ratelimit({
  redis,

  limiter: Ratelimit.fixedWindow(5, "15 m"),

  analytics: true,

  prefix: "frameflow-auth",
});

export const uploadLimiter = new Ratelimit({
  redis,

  limiter: Ratelimit.fixedWindow(5, "1 h"),

  analytics: true,

  prefix: "frameflow-upload",
});