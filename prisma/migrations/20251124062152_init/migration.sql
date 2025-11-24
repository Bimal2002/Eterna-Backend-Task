-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "tokenIn" TEXT NOT NULL,
    "tokenOut" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "selectedDex" TEXT,
    "executedPrice" DOUBLE PRECISION,
    "txHash" TEXT,
    "failureReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);
