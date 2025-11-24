import { Worker } from "bullmq";
import { redis } from "../../config/redis";
import { env } from "../../config/env";
import { DexRouter } from "../dex/dexRouter";
import { orderService } from "./order.service";
import type { OrderJobData } from "./order.queue";
import { sleep } from "../../libs/utils";
import { logger } from "../../libs/logger";

const router = new DexRouter();

const handleOrderProcessing = async (job: { data: OrderJobData }) => {
  const { orderId, payload } = job.data;

  logger.info("Processing order", { orderId });

  // Find best DEX price
  await orderService.updateStatus(orderId, "routing");
  await sleep(200);

  const { best } = await router.getBestQuote(
    payload.tokenIn,
    payload.tokenOut,
    payload.amount
  );

  logger.info("Routing decision", { orderId, bestDex: best.dex });
  await orderService.saveRoutingChoice(orderId, best.dex);
  
  await orderService.updateStatus(orderId, "building");
  await sleep(200);
  await orderService.updateStatus(orderId, "submitted");

  try {
    const result = await router.executeOnDex(
      best.dex,
      payload.tokenIn,
      payload.tokenOut,
      payload.amount
    );

    await orderService.markAsSuccessful(orderId, result.executedPrice, result.txHash);
    logger.info("Order confirmed", { orderId, txHash: result.txHash });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Swap execution failed";
    logger.error("Order failed", { orderId, error: errorMsg });
    await orderService.markAsFailed(orderId, errorMsg);
    throw error;
  }
};

export const startOrderWorker = () => {
  const worker = new Worker<OrderJobData>("orders", handleOrderProcessing, {
    connection: redis,
    prefix: env.BULLMQ_PREFIX,
    concurrency: env.CONCURRENT_ORDERS,
  });

  worker.on("failed", (job, error) => {
    if (job) {
      logger.error("Job failed after retries", {
        jobId: job.id,
        reason: error.message,
      });
    }
  });

  return worker;
}
