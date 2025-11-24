import { prisma } from "../../config/database";
import type { CreateOrderDto } from "./order.types";

export const orderService = {
  async createInitialOrder(id: string, data: CreateOrderDto) {
    return prisma.order.create({
      data: {
        id,
        type: data.type,
        tokenIn: data.tokenIn,
        tokenOut: data.tokenOut,
        amount: data.amount,
        status: "pending",
      },
    });
  },

  async updateStatus(id: string, status: string) {
    return prisma.order.update({ where: { id }, data: { status } });
  },

  async saveRoutingChoice(id: string, dex: string) {
    return prisma.order.update({ where: { id }, data: { selectedDex: dex } });
  },

  async markAsSuccessful(id: string, price: number, txHash: string) {
    return prisma.order.update({
      where: { id },
      data: { status: "confirmed", executedPrice: price, txHash },
    });
  },

  async markAsFailed(id: string, reason: string) {
    return prisma.order.update({
      where: { id },
      data: { status: "failed", failureReason: reason },
    });
  },

  async getOrder(id: string) {
    return prisma.order.findUnique({ where: { id } });
  },
};
