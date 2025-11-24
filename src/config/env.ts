import "dotenv/config";
export const env = {
  PORT: Number(process.env.PORT ?? 3000),
  NODE_ENV: process.env.NODE_ENV ?? "development",
  DATABASE_URL:
    process.env.DATABASE_URL ??
    "postgresql://postgres:postgres@127.0.0.1:5432/orders_db",
  REDIS_URL: process.env.REDIS_URL ?? "redis://127.0.0.1:6379",
  BULLMQ_PREFIX: process.env.BULLMQ_PREFIX ?? "oe:",
  CONCURRENT_ORDERS: Number(process.env.CONCURRENT_ORDERS ?? 10),
};
