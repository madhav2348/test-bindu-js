import { JsonRpcResponse } from "../client/json-rpc";

export interface MessagePart {
  kind: "text";
  text: string;
}

export interface PaymentPayload {
  resource: string;
  scheme: string;
  network: string;
  asset: string;
  payTo: string;
  amount: string;
  signature: string;
  timestamp: string;
  payer: string;
}

export interface MessageMetadata {
  "x402.payment.status"?: string;
  "x402.payment.payload"?: PaymentPayload;
}

export interface BinduMessage {
  role: "user" | "assistant" | "system";
  parts: MessagePart[];
  kind: "message";
  messageId: string;
  contextId: string;
  taskId: string;
  metadata?: MessageMetadata;
  referenceTaskIds?: string[];
}

export interface SendMessageConfiguration {
  acceptedOutputModes?: string[];
}

export interface SendMessageParams {
  message: BinduMessage;
  configuration?: SendMessageConfiguration;
}

export interface TaskStatus {
  state: string;
  timestamp?: string;
}

export interface TextArtifact {
  kind: "text";
  text: string;
}

export interface TaskResult {
  taskId: string;
  contextId?: string;
  status: TaskStatus;
  artifacts?: TextArtifact[];
}

export interface SendMessageResult {
  task: TaskResult;
}

export type SendMessageResponse = JsonRpcResponse<SendMessageResult>;

export interface GetTaskParams {
  taskId: string;
}

export interface GetTaskResult {
  task: TaskResult;
}

export type GetTaskResponse = JsonRpcResponse<GetTaskResult>;

export interface ListTasksParams {}

export interface ListTasksResult {
  tasks: TaskResult[];
}

export type ListTasksResponse = JsonRpcResponse<ListTasksResult>;

export interface CancelTaskParams {
  taskId: string;
}

export interface CancelTaskResult {
  task: TaskResult;
}

export type CancelTaskResponse = JsonRpcResponse<CancelTaskResult>;

export interface FeedbackMetadata {
  category?: string;
  source?: string;
  helpful?: boolean;
  [key: string]: unknown;
}

export interface SubmitTaskFeedbackParams {
  taskId: string;
  feedback: string;
  rating: number;
  metadata?: FeedbackMetadata;
}

export interface SubmitTaskFeedbackResult {
  success: boolean;
}

export type SubmitTaskFeedbackResponse =
  JsonRpcResponse<SubmitTaskFeedbackResult>;

export interface ContextSummary {
  contextId: string;
  [key: string]: unknown;
}

export interface ListContextsParams {
  length: number;
}

export interface ListContextsResult {
  contexts: ContextSummary[];
}

export type ListContextsResponse = JsonRpcResponse<ListContextsResult>;

export interface ClearContextParams {
  contextId: string;
}

export interface ClearContextResult {
  success: boolean;
}

export type ClearContextResponse = JsonRpcResponse<ClearContextResult>;

export type MetricsResponse = string;

export interface HealthRuntime {
  storage_backend: string;
  scheduler_backend: string;
  task_manager_running: boolean;
  strict_ready: boolean;
}

export interface HealthApplication {
  penguin_id: string;
  agent_did: string;
}

export interface HealthSystem {
  python_version: string;
  platform: string;
  platform_release: string;
  environment: string;
}

export interface HealthResponse {
  status: string;
  ready: boolean;
  uptime_seconds: number;
  version: string;
  health: string;
  runtime: HealthRuntime;
  application: HealthApplication;
  system: HealthSystem;
}

export interface ResolveDidParams {
  did: string;
}

export interface DidVerificationMethod {
  id: string;
  type: string;
  controller: string;
  publicKeyBase58: string;
}

export interface DidDocument {
  "@context": string[];
  id: string;
  created: string;
  authentication: DidVerificationMethod[];
}

export interface DidResolveErrorResponse {
  error: string;
  details?: string;
}

export interface NegotiationWeights {
  skill_match: number;
  io_compatibility: number;
  performance?: number;
  load?: number;
  cost?: number;
}

export interface NegotiationRequest {
  task_summary: string;
  task_details: string;
  input_mime_types: string[];
  output_mime_types: string[];
  max_latency_ms?: number;
  max_cost_amount?: string;
  required_tools?: string[];
  forbidden_tools?: string[];
  min_score?: number;
  weights?: NegotiationWeights;
}

export interface SkillMatch {
  skill_id: string;
  skill_name: string;
  score: number;
  reasons: string[];
}

export interface NegotiationSubscores {
  skill_match?: number;
  io_compatibility?: number;
  performance?: number;
  load?: number;
  cost?: number;
}

export interface NegotiationResponse {
  accepted: boolean;
  score: number;
  confidence: number;
  rejection_reason?: string;
  skill_matches: SkillMatch[];
  matched_tags: string[];
  matched_capabilities: string[];
  latency_estimate_ms: number;
  queue_depth: number;
  subscores: NegotiationSubscores;
}

export interface NegotiationErrorResponse {
  error: string;
  details?: string;
}

export type PaymentCaptureResponse = string;

export interface PaymentCaptureErrorResponse {
  error: string;
  details?: string;
}

export interface GetPaymentStatusParams {
  sessionId: string;
}

export type PaymentStatusResponse = string;

export interface PaymentRequirements {
  resource: string;
  scheme: string;
  network: string;
  asset: string;
  payTo: string;
  amount: string;
  description: string;
}

export interface StartPaymentSessionResponse {
  sessionId: string;
  paymentRequirements: PaymentRequirements;
  expiresAt: string;
}

export interface AgentSkill {
  id: string;
  name: string;
  documentationPath: string;
}

export interface AgentCapabilityExtension {
  uri: string;
  description?: string;
  required: boolean;
  params?: Record<string, unknown>;
}

export interface AgentCapabilities {
  extensions: AgentCapabilityExtension[];
  pushNotifications: boolean;
  streaming: boolean;
}

export interface AgentTrust {
  identityProvider: string;
  inheritedRoles: string[];
  creatorId: string;
  creationTimestamp: number;
  trustVerificationRequired: boolean;
  allowedOperations: Record<string, unknown>;
}

export interface AgentCard {
  id: string;
  name: string;
  description: string;
  url: string;
  version: string;
  protocolVersion: string;
  skills: AgentSkill[];
  capabilities: AgentCapabilities;
  kind: string;
  numHistorySessions: number;
  extraData: Record<string, unknown>;
  debugMode: boolean;
  debugLevel: number;
  monitoring: boolean;
  telemetry: boolean;
  agentTrust: AgentTrust;
  defaultInputModes: string[];
  defaultOutputModes: string[];
}

export interface SkillSummary {
  id: string;
  name: string;
  description: string;
  version: string;
  tags: string[];
  input_modes: string[];
  output_modes: string[];
  examples: string[];
  documentation_path: string;
}

export interface ListSkillsResponse {
  skills: SkillSummary[];
  total: number;
}

export interface GetSkillParams {
  skillId: string;
}

export interface SkillRequirements {
  packages: string[];
  system: string[];
  min_memory_mb: number;
}

export interface SkillPerformance {
  avg_processing_time_ms: number;
  max_file_size_mb: number;
  max_pages: number;
  concurrent_requests: number;
}

export interface SkillUseCases {
  when_to_use: string[];
  when_not_to_use: string[];
}

export interface SkillBestPractices {
  for_developers: string[];
  for_orchestrators: string[];
}

export interface SkillDocumentationData {
  overview: string;
  use_cases: SkillUseCases;
  best_practices: SkillBestPractices;
}

export interface SkillSpecialization {
  domain: string;
  confidence_boost: number;
}

export interface SkillAssessment {
  keywords: string[];
  specializations: SkillSpecialization[];
  anti_patterns: string[];
}

export interface SkillDetail {
  id: string;
  name: string;
  description: string;
  tags: string[];
  input_modes: string[];
  output_modes: string[];
  version: string;
  author: string;
  examples: string[];
  capabilities_detail: Record<string, unknown>;
  requirements: SkillRequirements;
  performance: SkillPerformance;
  allowed_tools: string[];
  documentation: SkillDocumentationData;
  assessment: SkillAssessment;
  documentation_path: string;
  has_documentation: boolean;
}

export type SkillDocumentationResponse = string;

export interface SkillErrorResponse {
  error: string;
  details?: string;
}
