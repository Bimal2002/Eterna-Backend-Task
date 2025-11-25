import { buildApp } from './app';
import { env } from './config/env';
import { redis } from './config/redis';
import { startOrderWorker } from './modules/orders/order.worker';

const server = buildApp();
const queueWorker = startOrderWorker();

const start = async () => {
  try {
    await redis.connect();
    console.log('Redis connected');
    await server.listen({ port: env.PORT, host: '0.0.0.0' });
    console.log(`Server running at http://localhost:${env.PORT}`);
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
};

start();
