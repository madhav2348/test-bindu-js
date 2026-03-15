import { BinduConfig } from "../config";

export type BindufyType = {
  config: BinduConfig; // validated bindufy config
  run_server?: boolean; // default true
  key_dir?: string | null; // path where keys live
  launch?: boolean; // default false
};
