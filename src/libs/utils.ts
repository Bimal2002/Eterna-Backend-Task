export const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export const generateMockTxHash = () => {
  const randomHex = Math.random().toString(16).slice(2);
  const paddedHex = randomHex.padEnd(64, "0").slice(0, 64);
  return "0x" + paddedHex;
};
