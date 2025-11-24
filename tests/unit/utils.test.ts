import { describe, it, expect } from 'vitest';
import { generateMockTxHash } from '../../src/libs/utils';

describe('utils', () => {
  it('generates a hex-like tx hash', () => {
    const hash = generateMockTxHash();
    expect(hash.startsWith('0x')).toBe(true);
    expect(hash.length).toBeGreaterThan(10);
  });
});
