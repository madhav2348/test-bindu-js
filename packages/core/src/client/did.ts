/**
 * Decentralized Identifier resolution endpoints.
 */

import { JsonRpcResponse } from "./json-rpc";
import { DidDocument, DidResolveErrorResponse, ResolveDidParams } from "../types";
import {
  DidResolveError,
  JsonRpcError,
  NetworkError,
} from "../utils/error";

export interface DidClientConfig {
  baseUrl: string;
  fetchFn?: typeof fetch;
}

export class DidClient {
  private readonly baseUrl: string;
  private readonly fetchFn: typeof fetch;

  constructor(config: DidClientConfig) {
    this.baseUrl = config.baseUrl;
    this.fetchFn = config.fetchFn ?? fetch;
  }

  async resolveDid(params: ResolveDidParams): Promise<DidDocument> {
    const url = new URL("/did/resolve", this.baseUrl).toString();

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
      throw new NetworkError(0, "Failed to reach the DID resolve endpoint.", error);
    }

    const json = (await response.json()) as
      | DidDocument
      | DidResolveErrorResponse
      | JsonRpcResponse<never>;

    if (!response.ok) {
      if ("error" in json && typeof json.error === "string") {
        const didError = json as DidResolveErrorResponse;
        throw new DidResolveError(
          response.status,
          didError.error,
          didError.details,
        );
      }

      if ("error" in json && json.error && typeof json.error === "object") {
        throw new JsonRpcError(
          json.error.code,
          json.error.message,
          json.error.data,
        );
      }

      throw new NetworkError(
        response.status,
        `DID resolve endpoint returned HTTP ${response.status}.`,
      );
    }

    return json as DidDocument;
  }
}
