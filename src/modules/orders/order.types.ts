import { z } from "zod";

export const orderTypeSchema = z.literal("market");

export type OrderType = z.infer<typeof orderTypeSchema>;

export const createOrderSchema = z.object({
  type: orderTypeSchema.default("market"),
  tokenIn: z.string().min(1),
  tokenOut: z.string().min(1),
  amount: z.number().positive(),
});

export type CreateOrderDto = z.infer<typeof createOrderSchema>;
