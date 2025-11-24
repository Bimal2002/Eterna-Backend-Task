import type { WebSocketHandler } from "@fastify/websocket";
import { orderService } from "./order.service";
import { logger } from "../../libs/logger";

const POLL_INTERVAL = 500;

export const createStatusStreamHandler = (): WebSocketHandler => {
  return async (connection, req) => {
    const { orderId } = req.params as { orderId: string };

    if (!orderId) {
      connection.send(JSON.stringify({ error: "orderId required" }));
      connection.close();
      return;
    }

    logger.info("WebSocket attached", { orderId });

    const interval = setInterval(async () => {
      const order = await orderService.getOrder(orderId);
      if (!order) return;

      connection.send(
        JSON.stringify({
          orderId,
          status: order.status,
          selectedDex: order.selectedDex,
          executedPrice: order.executedPrice,
          txHash: order.txHash,
          failureReason: order.failureReason,
        })
      );

      const isFinalState =
        order.status === "confirmed" || order.status === "failed";
      if (isFinalState) {
        clearInterval(interval);
        connection.close();
      }
    }, POLL_INTERVAL);

    connection.on("close", () => clearInterval(interval));
  };
};
