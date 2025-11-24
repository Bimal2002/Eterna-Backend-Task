import type { FastifyPluginAsync } from "fastify";
import { executeOrderHandler } from "./order.controller";
import { createStatusStreamHandler } from "./order.websocket";

export const orderRouter: FastifyPluginAsync = async (fastify) => {
  fastify.post("/execute", executeOrderHandler);
  fastify.get(
    "/status/:orderId",
    { websocket: true },
    createStatusStreamHandler()
  );
};
