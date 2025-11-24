import { buildApp } from './app';
import { env } from './config/env';
import { startOrderWorker } from './modules/orders/order.worker';

const server = buildApp();
const queueWorker = startOrderWorker();

const start = async () => {
  try {
    await server.listen({ port: env.PORT, host: '0.0.0.0' });
    console.log(`Server running at http://localhost:${env.PORT}`);
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
};

start();
