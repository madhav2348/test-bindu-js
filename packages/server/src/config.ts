// TODO: remove commented types later

export interface BinduConfig {
  author: string; // required for Hibiscus registration
  name: string; // human-readable agent name
  id?: string; // optional unique identifier
  description?: string;
  version?: string; // defaults to 1.0.0 in the backend
  recreate_keys?: boolean; // force regeneration of existing keys
  skills?: string[]; // e.g. ["skills/question-answering"]
  env_file?: string; // path to .env for local dev
//   capabilities?: CapabilitiesConfig; // streaming / notifications etc
//   agent_trust?: AgentTrustConfig; // trust and security knobs
  kind?: "agent" | "team" | "workflow"; // default: agent
  debug_mode?: boolean;
  debug_level?: number; // default: 1
  monitoring?: boolean;
  telemetry?: boolean; // default: true
  num_history_sessions?: number; // default: 10
  documentation_url?: string;
  extra_metadata?: Record<string, unknown>;
  deployment?: DeploymentConfig;
 
//   storage?: StorageConfig;
//   scheduler?: SchedulerConfig;
  global_webhook_url?: string;
  global_webhook_token?: string;
}

export interface AgentExtension {
  uri: string; // URI of the extension
  description?: string; // how the agent uses this extension
  required?: boolean; // whether clients must follow specific requirements
  params?: Record<string, unknown>; // optional configuration
}

// export interface AgentCapabilities {
//   extensions?: AgentExtension[]; // list of extensions supported by the agent
//   push_notifications?: boolean; // supports push notifications
//   state_transition_history?: boolean; // supports state transition history
//   streaming?: boolean; // supports streaming

// }

// export interface AgentTrustConfig {
//   allow_insecure_tools?: boolean;
//   trusted_providers?: string[];
//   [rule: string]: unknown;
// }

export interface DeploymentConfig {
  url: string;
  expose?: boolean;
  protocol_version?: string;
  proxy_url?: string[] | null;
  cors_origin?: string[] | null;
  openapi_schema?: string | null;
}

// export interface StorageConfig {
//   type: "postgres" | "memory";
//   database_url?: string | null;
// }

// export interface SchedulerConfig {
//   type: "redis" | "memory";
//   redis_url?: string | null;
//   redis_host?: string;
//   redis_port?: number;
//   redis_password?: string | null;
//   redis_db?: number;
//   queue_name?: string;
//   max_connections?: number;
//   retry_on_timeout?: boolean;
//   poll_timeout?: number;
// }

