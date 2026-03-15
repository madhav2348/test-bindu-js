export interface BinduConfig {
  /**
     * 
     * 
     * - author: Agent author email (required for Hibiscus registration)
            - name: Human-readable agent name
            - id: Unique agent identifier (optional, auto-generated if not provided)
            - description: Agent description
            - version: Agent version string (default: "1.0.0")
            - recreate_keys: Force regeneration of existing keys (default: True)
            - skills: List of agent skills/capabilities
            - env_file: Path to .env file (optional, for local development)
            - capabilities: Technical capabilities (streaming, notifications, etc.)
            - agent_trust: Trust and security configuration
            - kind: Agent type ('agent', 'team', or 'workflow') (default: "agent")
            - debug_mode: Enable debug logging (default: False)
            - debug_level: Debug verbosity level (default: 1)
            - monitoring: Enable monitoring/metrics (default: False)
            - telemetry: Enable telemetry collection (default: True)
            - num_history_sessions: Number of conversation histories to maintain (default: 10)
            - documentation_url: URL to agent documentation
            - extra_metadata: Additional metadata dictionary
            - deployment: Deployment configuration dict
            - storage: Storage backend configuration dict
            - scheduler: Task scheduler configuration dict
            - global_webhook_url: Default webhook URL for all tasks (optional)
            - global_webhook_token: Authentication token for global webhook (optional)
     */
}

export interface AgentSkill {}

export interface DeploymentConfig {
  readonly url: string;
  readonly expose: string;
  readonly protocol_version: string;
  readonly proxy_url: string[] | null;
  readonly cors_origin: string[] | null;
  readonly openapi_schema: string | null;
}


