/**
 * Capability assessment endpoint for task negotiation.
 */

import { NegotiationErrorResponse, NegotiationRequest, NegotiationResponse } from "../types";
import { NegotiationError, NetworkError } from "../utils/error";

export interface NegotiationClientConfig {
  baseUrl: string;
  fetchFn?: typeof fetch;
}

export interface NegotiationType {
  negotiate(params: NegotiationRequest): Promise<NegotiationResponse>;
}

export class NegotiationClient implements NegotiationType {
  private readonly baseUrl: string;
  private readonly fetchFn: typeof fetch;

  constructor(config: NegotiationClientConfig) {
    this.baseUrl = config.baseUrl;
    this.fetchFn = config.fetchFn ?? fetch;
  }

  async negotiate(params: NegotiationRequest): Promise<NegotiationResponse> {
    const url = new URL("/agent/negotiation", this.baseUrl).toString();

    let response: Response;

    try {
      response = await this.fetchFn(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
    } catch (error) {
      throw new NetworkError(
        0,
        "Failed to reach the negotiation endpoint.",
        error,
      );
    }

    const json = (await response.json()) as
      | NegotiationResponse
      | NegotiationErrorResponse;

    if (!response.ok) {
      const negotiationError = json as NegotiationErrorResponse;
      throw new NegotiationError(
        response.status,
        negotiationError.error,
        negotiationError.details,
      );
    }

    return json as NegotiationResponse;
  }
}
