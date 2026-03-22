/**
 * x402 payment protocol endpoints for paid agent services.
 */

import {
  GetPaymentStatusParams,
  PaymentCaptureErrorResponse,
  PaymentCaptureResponse,
  PaymentRequirements,
  PaymentStatusResponse,
  StartPaymentSessionResponse,
} from "../types";
import {
  AuthenticationError,
  NetworkError,
  PaymentCaptureError,
  PaymentSessionError,
  PaymentStatusError,
} from "../utils/error";
import { getAuthHeader } from "../utils/http";

export interface PaymentClientConfig {
  apiKey: string;
  baseUrl: string;
  fetchFn?: typeof fetch;
}

export class PaymentClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly fetchFn: typeof fetch;

  constructor(config: PaymentClientConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl;
    this.fetchFn = config.fetchFn ?? fetch;
  }

  async capture(): Promise<PaymentCaptureResponse> {
    const url = new URL("/payment-capture", this.baseUrl).toString();

    let response: Response;

    try {
      response = await this.fetchFn(url, {
        method: "GET",
      });
    } catch (error) {
      throw new NetworkError(
        0,
        "Failed to reach the payment capture endpoint.",
        error,
      );
    }

    if (!response.ok) {
      const json = (await response.json()) as PaymentCaptureErrorResponse;
      throw new PaymentCaptureError(
        response.status,
        json.error,
        json.details,
      );
    }

    return response.text();
  }

  async getPaymentStatus(
    params: GetPaymentStatusParams,
  ): Promise<PaymentStatusResponse> {
    const url = new URL(
      `/api/payment-status/${params.sessionId}`,
      this.baseUrl,
    ).toString();

    let response: Response;

    try {
      response = await this.fetchFn(url, {
        method: "GET",
        headers: getAuthHeader(this.apiKey),
      });
    } catch (error) {
      throw new NetworkError(
        0,
        "Failed to reach the payment status endpoint.",
        error,
      );
    }

    if (!response.ok) {
      const json = (await response.json()) as PaymentCaptureErrorResponse;

      if (response.status === 401) {
        throw new AuthenticationError(
          response.status,
          json.error,
          json.details,
        );
      }

      throw new PaymentStatusError(
        response.status,
        json.error,
        json.details,
      );
    }

    return response.text();
  }

  async startPaymentSession(): Promise<StartPaymentSessionResponse> {
    const url = new URL("/api/start-payment-session", this.baseUrl).toString();

    let response: Response;

    try {
      response = await this.fetchFn(url, {
        method: "POST",
        headers: getAuthHeader(this.apiKey),
      });
    } catch (error) {
      throw new NetworkError(
        0,
        "Failed to reach the payment session endpoint.",
        error,
      );
    }

    if (!response.ok) {
      const json = (await response.json()) as PaymentCaptureErrorResponse;

      if (response.status === 401) {
        throw new AuthenticationError(
          response.status,
          json.error,
          json.details,
        );
      }

      throw new PaymentSessionError(
        response.status,
        json.error,
        json.details,
      );
    }

    return (await response.json()) as StartPaymentSessionResponse;
  }
}
