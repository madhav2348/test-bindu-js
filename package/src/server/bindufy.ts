import { BinduConfig } from "../config";

// Options bag keeps client code ergonomic: bindufy(cfg, handler, { launch: true })
export function bindufy<T>(
  config: BinduConfig,
  handler: (messages: Record<string, string>[]) => T | Promise<T>,
  options: {
    runServer?: boolean; // default true
    keyDir?: string | null;
    launch?: boolean; // default true
  } = {},
) {
  const { runServer = true, keyDir = null, launch = true } = options;


}
