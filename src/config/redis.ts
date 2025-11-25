import { Redis } from "ioredis";
import { env } from "./env";

const createRedisConnection = () => {
  if (env.REDIS_URL.startsWith('redis://') || env.REDIS_URL.startsWith('rediss://')) {
    return new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: null,
      retryStrategy: (times) => Math.min(times * 50, 2000),
      lazyConnect: true,
    });
  }
  return new Redis({
    host: '127.0.0.1',
    port: 6379,
    maxRetriesPerRequest: null,
    retryStrategy: (times) => Math.min(times * 50, 2000),
    lazyConnect: true,
  });
};

export const redis = createRedisConnection();
