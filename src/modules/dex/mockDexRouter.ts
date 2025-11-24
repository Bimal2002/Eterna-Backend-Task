import { sleep, generateMockTxHash } from "../../libs/utils";

export type DexName = "raydium" | "meteora";

export interface DexQuote {
  dex: DexName;
  price: number;
  fee: number;
}

export interface MockOrder {
  tokenIn: string;
  tokenOut: string;
  amount: number;
}

const BASE_PRICE = 100;

export class MockDexRouter {
  async getRaydiumQuote(
    tokenIn: string,
    tokenOut: string,
    amount: number
  ): Promise<DexQuote> {
    // Simulate network delay
    await sleep(200 + Math.random() * 200);

    const variance = 0.98 + Math.random() * 0.04;
    const price = BASE_PRICE * variance;
    
    return { dex: "raydium", price, fee: 0.003 };
  }

  async getMeteoraQuote(
    tokenIn: string,
    tokenOut: string,
    amount: number
  ): Promise<DexQuote> {
    await sleep(200 + Math.random() * 200);

    const variance = 0.97 + Math.random() * 0.05;
    const price = BASE_PRICE * variance;
    
    return { dex: "meteora", price, fee: 0.002 };
  }

  async executeSwap(dex: DexName, order: MockOrder) {
    // Simulate transaction processing
    const processingTime = 2000 + Math.random() * 1000;
    await sleep(processingTime);

    const priceVariation = 0.98 + Math.random() * 0.04;
    const executedPrice = BASE_PRICE * priceVariation;
    
    return { 
      txHash: generateMockTxHash(), 
      executedPrice 
    };
  }
}
