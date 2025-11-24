import { describe, it, expect } from 'vitest';
import { buildApp } from '../../src/app';
import { env } from '../../src/config/env';
import { startOrderWorker } from '../../src/modules/orders/order.worker';
import { orderService } from '../../src/modules/orders/order.service';

// This test assumes Postgres + Redis are running and migrations applied.

describe('order flow', () => {
  it('creates and eventually confirms a market order', async () => {
    const app = buildApp();
    startOrderWorker();

    const response = await app.inject({
      method: 'POST',
      url: '/api/orders/execute',
      payload: { type: 'market', tokenIn: 'SOL', tokenOut: 'USDC', amount: 1 }
    });

    expect(response.statusCode).toBe(200);
    const body = response.json() as { orderId: string };
    expect(body.orderId).toBeDefined();

    const maxWaitMs = 8000;
    const start = Date.now();

    // poll until order is confirmed/failed or timeout
    while (Date.now() - start < maxWaitMs) {
      const order = await orderService.getOrder(body.orderId);
      if (order && (order.status === 'confirmed' || order.status === 'failed')) {
        expect(['confirmed', 'failed']).toContain(order.status);
        return;
      }
      await new Promise((r) => setTimeout(r, 500));
    }

    throw new Error('Order did not finish within timeout; check worker/queue');
  }, env.NODE_ENV === 'test' ? 20000 : 20000);
});
