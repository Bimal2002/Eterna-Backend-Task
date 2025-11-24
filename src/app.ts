import Fastify from 'fastify';
import websocket from '@fastify/websocket';
import { logger } from './libs/logger';
import { orderRouter } from './modules/orders/order.router';

export const buildApp = () => {
  const server = Fastify({ logger });

  server.register(websocket);
  server.register(orderRouter, { prefix: '/api/orders' });

  return server;
};
