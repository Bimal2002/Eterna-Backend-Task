export const logger = {
  info: (...args: unknown[]) => console.log("[info]", ...args),
  warn: (...args: unknown[]) => console.warn("[warn]", ...args),
  error: (...args: unknown[]) => console.error("[error]", ...args),
  debug: (...args: unknown[]) => console.log("[debug]", ...args),
  fatal: (...args: unknown[]) => console.error("[fatal]", ...args),
  trace: (...args: unknown[]) => console.log("[trace]", ...args),
  child: () => logger,
};
