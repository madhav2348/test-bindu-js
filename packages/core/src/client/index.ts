import { AgentClient } from "./agent";
import { JsonRpcClient } from "./json-rpc";
import { DidClient } from "./did";
import { MonitoringClient } from "./monitoring";
import { NegotiationClient } from "./negotiation";
import { PaymentClient } from "./payment";
import { SkillsClient } from "./skills";

export interface BinduClientConfig {
  apiKey: string;
  baseUrl?: string;
  fetchFn?: typeof fetch;
}

export class BinduClient {
  readonly agent: AgentClient;
  readonly did: DidClient;
  readonly monitoring: MonitoringClient;
  readonly negotiation: NegotiationClient;
  readonly payment: PaymentClient;
  readonly skills: SkillsClient;
  readonly jsonRpc: JsonRpcClient;

  constructor(config: BinduClientConfig) {
    const apiKey = config.apiKey;
    const baseUrl = config.baseUrl ?? "http://localhost:3773/";
    const fetchFn = config.fetchFn ?? fetch;

    const transportConfig = {
      apiKey,
      baseUrl,
    };

    this.jsonRpc = new JsonRpcClient(
      config.fetchFn
        ? { ...transportConfig, fetchFn: config.fetchFn }
        : transportConfig,
    );

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
