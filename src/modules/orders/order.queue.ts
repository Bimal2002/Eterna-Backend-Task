import { Queue } from "bullmq";
import { redis } from "../../config/redis";
import { env } from "../../config/env";
import type { CreateOrderDto } from "./order.types";

export interface OrderJobData {
  orderId: string;
  payload: CreateOrderDto;
}

const RETRY_CONFIG = {
  attempts: 3,
  backoff: {
    type: "exponential" as const,
    delay: 500,
  },
};

export const orderQueue = new Queue<OrderJobData>("orders", {
  connection: redis,
  prefix: env.BULLMQ_PREFIX,
});

export async function enqueueOrder(orderId: string, payload: CreateOrderDto) {
  await orderQueue.add("execute", { orderId, payload }, RETRY_CONFIG);
}
