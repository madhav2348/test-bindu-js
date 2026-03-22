/**
 * JSON-RPC 2.0 transport helpers for agent communication.
 */

import {
  CancelTaskParams,
  CancelTaskResponse,
  CancelTaskResult,
  ClearContextParams,
  ClearContextResponse,
  ClearContextResult,
  GetTaskParams,
  GetTaskResponse,
  GetTaskResult,
  ListContextsParams,
  ListContextsResponse,
  ListContextsResult,
  ListTasksParams,
  ListTasksResponse,
  ListTasksResult,
  SendMessageParams,
  SendMessageResponse,
  SendMessageResult,
  SubmitTaskFeedbackParams,
  SubmitTaskFeedbackResponse,
  SubmitTaskFeedbackResult,
} from "../types";
import {
  InvalidParamsError,
  JsonRpcError,
  NetworkError,
  TaskNotFoundError,
} from "../utils/error";
import { getHeader } from "../utils/http";

export enum RpcMethod {
  MessageSend = "message/send",
  TasksGet = "tasks/get",
  TasksList = "tasks/list",
  TasksCancel = "tasks/cancel",
  TasksFeedback = "tasks/feedback",
  ContextsList = "contexts/list",
  ContextsClear = "contexts/clear",
}

export interface JsonRpcRequest<TParams> {
  jsonrpc: "2.0";
  method: RpcMethod;
  params: TParams;
  id: string;
}

export interface JsonRpcErrorObject {
  code: number;
  message: string;
  data?: unknown;
}

export interface JsonRpcResponse<TResult> {
  jsonrpc: "2.0";
  id: string;
  result?: TResult;
  error?: JsonRpcErrorObject;
}

export interface JsonRpcTransportConfig {
  apiKey: string;
  baseUrl: string;
  fetchFn?: typeof fetch;
}

function createJsonRpcError(error: JsonRpcErrorObject): JsonRpcError {
  if (error.code === -32602) {
    return new InvalidParamsError(error.code, error.message, error.data);
  }

  if (error.code === -32001) {
    return new TaskNotFoundError(error.code, error.message, error.data);
  }

  return new JsonRpcError(error.code, error.message, error.data);
}

export class JsonRpcClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly fetchFn: typeof fetch;

  constructor(config: JsonRpcTransportConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl;
    this.fetchFn = config.fetchFn ?? fetch;
  }

  async request<TParams, TResult>(
    method: RpcMethod,
    params: TParams,
    id: string,
  ): Promise<JsonRpcResponse<TResult>> {
    const payload: JsonRpcRequest<TParams> = {
      jsonrpc: "2.0",
      method,
      params,
      id,
    };

    let response: Response;

    try {
      response = await this.fetchFn(this.baseUrl, {
        method: "POST",
        headers: getHeader(this.apiKey),
        body: JSON.stringify(payload),
      });
    } catch (error) {
      throw new NetworkError(
        0,
        "Failed to reach the Bindu server.",
        error,
      );
    }

    if (!response.ok) {
      throw new NetworkError(
        response.status,
        `Bindu server returned HTTP ${response.status}.`,
      );
    }

    const json = (await response.json()) as JsonRpcResponse<TResult>;

    if (json.error) {
      throw createJsonRpcError(json.error);
    }

    return json;
  }

  async sendMessage(
    params: SendMessageParams,
    id: string,
  ): Promise<SendMessageResponse> {
    return this.request<SendMessageParams, SendMessageResult>(
      RpcMethod.MessageSend,
      params,
      id,
    );
  }

  async sendMessageWithPayment(
    params: SendMessageParams,
    id: string,
  ): Promise<SendMessageResponse> {
    return this.sendMessage(params, id);
  }

  async sendMessageWithReference(
    params: SendMessageParams,
    id: string,
  ): Promise<SendMessageResponse> {
    return this.sendMessage(params, id);
  }

  async getTask(
    params: GetTaskParams,
    id: string,
  ): Promise<GetTaskResponse> {
    return this.request<GetTaskParams, GetTaskResult>(
      RpcMethod.TasksGet,
      params,
      id,
    );
  }

  async listTasks(
    params: ListTasksParams = {},
    id: string,
  ): Promise<ListTasksResponse> {
    return this.request<ListTasksParams, ListTasksResult>(
      RpcMethod.TasksList,
      params,
      id,
    );
  }

  async cancelTask(
    params: CancelTaskParams,
    id: string,
  ): Promise<CancelTaskResponse> {
    return this.request<CancelTaskParams, CancelTaskResult>(
      RpcMethod.TasksCancel,
      params,
      id,
    );
  }

  async submitTaskFeedback(
    params: SubmitTaskFeedbackParams,
    id: string,
  ): Promise<SubmitTaskFeedbackResponse> {
    return this.request<SubmitTaskFeedbackParams, SubmitTaskFeedbackResult>(
      RpcMethod.TasksFeedback,
      params,
      id,
    );
  }

  async listContexts(
    params: ListContextsParams,
    id: string,
  ): Promise<ListContextsResponse> {
    return this.request<ListContextsParams, ListContextsResult>(
      RpcMethod.ContextsList,
      params,
      id,
    );
  }

  async clearContext(
    params: ClearContextParams,
    id: string,
  ): Promise<ClearContextResponse> {
    return this.request<ClearContextParams, ClearContextResult>(
      RpcMethod.ContextsClear,
      params,
      id,
    );
  }
}
