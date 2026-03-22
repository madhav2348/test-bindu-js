/**
 * Decentralized Identifier resolution endpoints.
 */

import { JsonRpcErrorObject, JsonRpcResponse } from "./json-rpc";
import {
  DidDocument,
  DidResolveErrorResponse,
  DidResolveJsonRpcErrorResponse,
  ResolveDidParams,
} from "../types";
import { DidResolveError, NetworkError } from "../utils/error";

export interface DidClientConfig {
  baseUrl: string;
  fetchFn?: typeof fetch;
}

export interface DidResolutionType {
  resolveDid(params: ResolveDidParams): Promise<DidDocument>;
}

export class DidClient implements DidResolutionType {
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
      throw new NetworkError(
        0,
        "Failed to reach the DID resolve endpoint.",
        error,
      );
    }

    const json = (await response.json()) as
      | DidDocument
      | DidResolveErrorResponse
      | DidResolveJsonRpcErrorResponse
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

      if (
        "jsonrpc" in json &&
        typeof json.error === "object" &&
        json.error !== null &&
        "code" in json.error &&
        "message" in json.error
      ) {
        const rpcError = json.error as JsonRpcErrorObject;

        throw new DidResolveError(
          rpcError.code,
          rpcError.message,
          rpcError.data,
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
