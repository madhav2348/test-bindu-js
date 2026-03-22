/**
 * Agent skills and capabilities endpoints.
 */

import {
  GetSkillParams,
  ListSkillsResponse,
  SkillDetail,
  SkillDocumentationResponse,
  SkillErrorResponse,
} from "../types";
import {
  NetworkError,
  SkillDetailError,
  SkillDocumentationError,
} from "../utils/error";

export interface SkillsClientConfig {
  baseUrl: string;
  fetchFn?: typeof fetch;
}

export class SkillsClient {
  private readonly baseUrl: string;
  private readonly fetchFn: typeof fetch;

  constructor(config: SkillsClientConfig) {
    this.baseUrl = config.baseUrl;
    this.fetchFn = config.fetchFn ?? fetch;
  }

  async listSkills(): Promise<ListSkillsResponse> {
    const url = new URL("/agent/skills", this.baseUrl).toString();

    let response: Response;

    try {
      response = await this.fetchFn(url, { method: "GET" });
    } catch (error) {
      throw new NetworkError(0, "Failed to reach the skills endpoint.", error);
    }

    if (!response.ok) {
      throw new NetworkError(
        response.status,
        `Skills endpoint returned HTTP ${response.status}.`,
      );
    }

    return (await response.json()) as ListSkillsResponse;
  }

  async getSkill(params: GetSkillParams): Promise<SkillDetail> {
    const url = new URL(`/agent/skills/${params.skillId}`, this.baseUrl).toString();

    let response: Response;

    try {
      response = await this.fetchFn(url, { method: "GET" });
    } catch (error) {
      throw new NetworkError(0, "Failed to reach the skill detail endpoint.", error);
    }

    if (!response.ok) {
      const json = (await response.json()) as SkillErrorResponse;
      throw new SkillDetailError(response.status, json.error, json.details);
    }

    return (await response.json()) as SkillDetail;
  }

  async getSkillDocumentation(
    params: GetSkillParams,
  ): Promise<SkillDocumentationResponse> {
    const url = new URL(
      `/agent/skills/${params.skillId}/documentation`,
      this.baseUrl,
    ).toString();

    let response: Response;

    try {
      response = await this.fetchFn(url, { method: "GET" });
    } catch (error) {
      throw new NetworkError(
        0,
        "Failed to reach the skill documentation endpoint.",
        error,
      );
    }

    if (!response.ok) {
      const json = (await response.json()) as SkillErrorResponse;
      throw new SkillDocumentationError(
        response.status,
        json.error,
        json.details,
      );
    }

    return response.text();
  }
}
