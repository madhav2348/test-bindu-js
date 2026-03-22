import { AgentClient, AgentDiscoveryType } from "./agent";
import { DidClient, DidResolutionType } from "./did";
import { JsonRpcClient, JsonRpcType } from "./json-rpc";
import { HealthAndMonitoring, MonitoringClient } from "./monitoring";
import { NegotiationClient, NegotiationType } from "./negotiation";
import { PaymentClient, PaymentType } from "./payment";
import { SkillsClient, SkillsType } from "./skills";

export interface BinduClientConfig {
  apiKey: string;
  baseUrl?: string;
  fetchFn?: typeof fetch;
}

export class BinduClient {
  readonly agent: AgentDiscoveryType;
  readonly did: DidResolutionType;
  readonly monitoring: HealthAndMonitoring;
  readonly negotiation: NegotiationType;
  readonly payment: PaymentType;
  readonly skills: SkillsType;
  readonly jsonRpc: JsonRpcType;

  constructor(config: BinduClientConfig) {
    const apiKey = config.apiKey;
    const baseUrl = config.baseUrl ?? "http://localhost:3773/";
    const fetchFn = config.fetchFn ?? fetch;

    this.jsonRpc = new JsonRpcClient({
      apiKey,
      baseUrl,
      fetchFn,
    });

    this.agent = new AgentClient({
      baseUrl,
      fetchFn,
    });

    this.did = new DidClient({
      baseUrl,
      fetchFn,
    });

    this.monitoring = new MonitoringClient({
      apiKey,
      baseUrl,
      fetchFn,
    });

    this.negotiation = new NegotiationClient({
      baseUrl,
      fetchFn,
    });

    this.payment = new PaymentClient({
      apiKey,
      baseUrl,
      fetchFn,
    });

    this.skills = new SkillsClient({
      baseUrl,
      fetchFn,
    });
  }
}
