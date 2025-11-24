import { describe, it, expect } from 'vitest';
import { DexRouter } from '../../src/modules/dex/dexRouter';

describe('DexRouter', () => {
  it('returns a best quote and other quote', async () => {
    const router = new DexRouter();
    const { best, other } = await router.getBestQuote('A', 'B', 1);

    expect(best.dex === 'raydium' || best.dex === 'meteora').toBe(true);
    expect(other.dex === 'raydium' || other.dex === 'meteora').toBe(true);
    expect(best.dex).not.toBe(other.dex);
  });
});
