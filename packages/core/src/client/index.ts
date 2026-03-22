import { AgentClient } from "./agent";
import { JsonRpcClient } from "./json-rpc";
import { DidClient } from "./did";
import { MonitoringClient } from "./monitoring";
import { NegotiationClient } from "./negotiation";
import { PaymentClient } from "./payment";
import { SkillsClient } from "./skills";
import {
  AgentCard,
  GetPaymentStatusParams,
  GetSkillParams,
  ListSkillsResponse,
  HealthResponse,
  MetricsResponse,
  NegotiationRequest,
  NegotiationResponse,
  PaymentCaptureResponse,
  PaymentStatusResponse,
  ResolveDidParams,
  SkillDetail,
  SkillDocumentationResponse,
  StartPaymentSessionResponse,
} from "../types";

export interface BinduClientConfig {
  apiKey: string;
  baseUrl?: string;
  fetchFn?: typeof fetch;
}

export class BinduClient {
  private readonly agentClient: AgentClient;
  private readonly didClient: DidClient;
  private readonly monitoringClient: MonitoringClient;
  private readonly negotiationClient: NegotiationClient;
  private readonly paymentClient: PaymentClient;
  private readonly skillsClient: SkillsClient;
  private readonly rpcClient: JsonRpcClient;

  constructor(config: BinduClientConfig) {
    const apiKey = config.apiKey;
    const baseUrl = config.baseUrl ?? "http://localhost:3773/";
    const fetchFn = config.fetchFn ?? fetch;

    const transportConfig = {
      apiKey,
      baseUrl,
    };

    this.rpcClient = new JsonRpcClient(
      config.fetchFn
        ? { ...transportConfig, fetchFn: config.fetchFn }
        : transportConfig,
    );

    this.agentClient = new AgentClient({
      baseUrl,
      fetchFn,
    });

    this.didClient = new DidClient({
      baseUrl,
      fetchFn,
    });

    this.monitoringClient = new MonitoringClient({
      apiKey,
      baseUrl,
      fetchFn,
    });

    this.negotiationClient = new NegotiationClient({
      baseUrl,
      fetchFn,
    });

    this.paymentClient = new PaymentClient({
      apiKey,
      baseUrl,
      fetchFn,
    });

    this.skillsClient = new SkillsClient({
      baseUrl,
      fetchFn,
    });
  }

  async jsonRpc(): Promise<JsonRpcClient> {
    return this.rpcClient;
  }

  async metrics(): Promise<MetricsResponse> {
    return this.monitoringClient.metrics();
  }

  async health(): Promise<HealthResponse> {
    return this.monitoringClient.health();
  }

  async resolveDid(params: ResolveDidParams) {
    return this.didClient.resolveDid(params);
  }

  async negotiate(params: NegotiationRequest): Promise<NegotiationResponse> {
    return this.negotiationClient.negotiate(params);
  }

  async capturePayment(): Promise<PaymentCaptureResponse> {
    return this.paymentClient.capture();
  }

  async getPaymentStatus(
    params: GetPaymentStatusParams,
  ): Promise<PaymentStatusResponse> {
    return this.paymentClient.getPaymentStatus(params);
  }

  async startPaymentSession(): Promise<StartPaymentSessionResponse> {
    return this.paymentClient.startPaymentSession();
  }

  async getAgent(): Promise<AgentCard> {
    return this.agentClient.getAgent();
  }

  async listSkills(): Promise<ListSkillsResponse> {
    return this.skillsClient.listSkills();
  }

  async getSkill(params: GetSkillParams): Promise<SkillDetail> {
    return this.skillsClient.getSkill(params);
  }

  async getSkillDocumentation(
    params: GetSkillParams,
  ): Promise<SkillDocumentationResponse> {
    return this.skillsClient.getSkillDocumentation(params);
  }
}
