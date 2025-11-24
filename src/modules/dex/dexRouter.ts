import { MockDexRouter, DexQuote, DexName } from "./mockDexRouter";

export class DexRouter {
  private readonly mock = new MockDexRouter();

  async getBestQuote(
    tokenIn: string,
    tokenOut: string,
    amount: number
  ): Promise<{ best: DexQuote; other: DexQuote }> {
    const [raydium, meteora] = await Promise.all([
      this.mock.getRaydiumQuote(tokenIn, tokenOut, amount),
      this.mock.getMeteoraQuote(tokenIn, tokenOut, amount),
    ]);

    const best = raydium.price <= meteora.price ? raydium : meteora;
    const other = best === raydium ? meteora : raydium;

    return { best, other };
  }

  async executeOnDex(
    dex: DexName,
    tokenIn: string,
    tokenOut: string,
    amount: number
  ) {
    return this.mock.executeSwap(dex, { tokenIn, tokenOut, amount });
  }
}
