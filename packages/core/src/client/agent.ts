/*
 * Agent metadata and capability discovery endpoints.
 */

import { AgentCard } from "../types";
import { NetworkError } from "../utils/error";

export interface AgentClientConfig {
  baseUrl: string;
  fetchFn?: typeof fetch;
}

export interface AgentDiscoveryType {
  getAgent(): Promise<AgentCard>;
}

export class AgentClient implements AgentDiscoveryType {
  private readonly baseUrl: string;
  private readonly fetchFn: typeof fetch;

  constructor(config: AgentClientConfig) {
    this.baseUrl = config.baseUrl;
    this.fetchFn = config.fetchFn ?? fetch;
  }

  async getAgent(): Promise<AgentCard> {
    const url = new URL("/.well-known/agent.json", this.baseUrl).toString();

    let response: Response;

    try {
      response = await this.fetchFn(url, {
        method: "GET",
      });
    } catch (error) {
      throw new NetworkError(
        0,
        "Failed to reach the agent discovery endpoint.",
        error,
      );
    }

    if (!response.ok) {
      throw new NetworkError(
        response.status,
        `Agent discovery endpoint returned HTTP ${response.status}.`,
      );
    }

    return (await response.json()) as AgentCard;
  }
}
