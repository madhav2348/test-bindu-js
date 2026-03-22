/*
 * Health check and monitoring endpoints.
 */

import { MetricsResponse } from "../types";
import { HealthResponse } from "../types";
import { NetworkError } from "../utils/error";
import { getAuthHeader } from "../utils/http";

export interface MonitoringClientConfig {
  apiKey: string;
  baseUrl: string;
  fetchFn?: typeof fetch;
}

export interface HealthAndMonitoring {
  health(): Promise<HealthResponse>;
  metrics(): Promise<MetricsResponse>;
}

export class MonitoringClient implements HealthAndMonitoring {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly fetchFn: typeof fetch;

  constructor(config: MonitoringClientConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl;
    this.fetchFn = config.fetchFn ?? fetch;
  }

  async health(): Promise<HealthResponse> {
    const healthUrl = new URL("/health", this.baseUrl).toString();

    let response: Response;

    try {
      response = await this.fetchFn(healthUrl, {
        method: "GET",
        headers: getAuthHeader(this.apiKey),
      });
    } catch (error) {
      throw new NetworkError(
        0,
        "Failed to reach the Bindu health endpoint.",
        error,
      );
    }

    if (!response.ok) {
      throw new NetworkError(
        response.status,
        `Bindu health endpoint returned HTTP ${response.status}.`,
      );
    }

    return (await response.json()) as HealthResponse;
  }

  async metrics(): Promise<MetricsResponse> {
    const metricsUrl = new URL("/metrics", this.baseUrl).toString();

    let response: Response;

    try {
      response = await this.fetchFn(metricsUrl, {
        method: "GET",
        headers: getAuthHeader(this.apiKey),
      });
    } catch (error) {
      throw new NetworkError(
        0,
        "Failed to reach the Bindu metrics endpoint.",
        error,
      );
    }

    if (!response.ok) {
      throw new NetworkError(
        response.status,
        `Bindu metrics endpoint returned HTTP ${response.status}.`,
      );
    }

    return response.text();
  }
}
