import type { FastifyRequest, FastifyReply } from "fastify";
import { v4 as generateId } from "uuid";
import { createOrderSchema } from "./order.types";
import { orderService } from "./order.service";
import { enqueueOrder } from "./order.queue";
import { logger } from "../../libs/logger";

export const executeOrderHandler = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const result = createOrderSchema.safeParse(req.body ?? {});

  if (!result.success) {
    return res.status(400).send({
      error: "ValidationError",
      details: result.error.flatten(),
    });
  }

  const orderData = result.data;
  const orderId = generateId();

  await orderService.createInitialOrder(orderId, orderData);
  logger.info("Order received", { orderId, orderData });

  await enqueueOrder(orderId, orderData);

  return res.send({ orderId, status: "pending" });
};
