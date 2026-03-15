import { BinduConfig } from "../config";

export function bindufy<T>(
  config: BinduConfig,
  handler: (messages: Record<string, string>[]) => T | Promise<T>,
  runServer?: boolean, // true
  keyDir?: string | null,
  launch?: boolean, // false
) {


}
