import { describe, it, expect } from "vitest";
import { buildApp } from "../../src/app";
import { startOrderWorker } from "../../src/modules/orders/order.worker";
import { orderService } from "../../src/modules/orders/order.service";

describe("concurrent orders", () => {
  it("processes multiple orders in parallel", async () => {
    const app = buildApp();
    startOrderWorker();

    const count = 5;
    const results = await Promise.all(
      Array.from({ length: count }).map((_, i) =>
        app.inject({
          method: "POST",
          url: "/api/orders/execute",
          payload: {
            type: "market",
            tokenIn: "SOL",
            tokenOut: "USDC",
            amount: 1 + i,
          },
        })
      )
    );

    const ids = results.map((r) => (r.json() as { orderId: string }).orderId);

    const maxWaitMs = 15000;
    const start = Date.now();

    while (Date.now() - start < maxWaitMs) {
      const orders = await Promise.all(
        ids.map((id) => orderService.getOrder(id))
      );
      if (
        orders.every(
          (o) => o && (o.status === "confirmed" || o.status === "failed")
        )
      ) {
        expect(orders.length).toBe(count);
        return;
      }
      await new Promise((r) => setTimeout(r, 500));
    }

    throw new Error("Not all orders finished within timeout");
  }, 25000);
});
