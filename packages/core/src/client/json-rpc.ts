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
  JsonRpcMethodInput,
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
import { getHeader } from "../utils/header";

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
    input: JsonRpcMethodInput<SendMessageParams>,
  ): Promise<SendMessageResponse> {
    const { id, ...params } = input;
    return this.request<SendMessageParams, SendMessageResult>(
      RpcMethod.MessageSend,
      params as SendMessageParams,
      id,
    );
  }

  async sendMessageWithPayment(
    input: JsonRpcMethodInput<SendMessageParams>,
  ): Promise<SendMessageResponse> {
    return this.sendMessage(input);
  }

  async sendMessageWithReference(
    input: JsonRpcMethodInput<SendMessageParams>,
  ): Promise<SendMessageResponse> {
    return this.sendMessage(input);
  }

  async getTask(
    input: JsonRpcMethodInput<GetTaskParams>,
  ): Promise<GetTaskResponse> {
    const { id, ...params } = input;
    return this.request<GetTaskParams, GetTaskResult>(
      RpcMethod.TasksGet,
      params as GetTaskParams,
      id,
    );
  }

  async listTasks(
    input: JsonRpcMethodInput<ListTasksParams>,
  ): Promise<ListTasksResponse> {
    const { id, ...params } = input;
    return this.request<ListTasksParams, ListTasksResult>(
      RpcMethod.TasksList,
      params as ListTasksParams,
      id,
    );
  }

  async cancelTask(
    input: JsonRpcMethodInput<CancelTaskParams>,
  ): Promise<CancelTaskResponse> {
    const { id, ...params } = input;
    return this.request<CancelTaskParams, CancelTaskResult>(
      RpcMethod.TasksCancel,
      params as CancelTaskParams,
      id,
    );
  }

  async submitTaskFeedback(
    input: JsonRpcMethodInput<SubmitTaskFeedbackParams>,
  ): Promise<SubmitTaskFeedbackResponse> {
    const { id, ...params } = input;
    return this.request<SubmitTaskFeedbackParams, SubmitTaskFeedbackResult>(
      RpcMethod.TasksFeedback,
      params as SubmitTaskFeedbackParams,
      id,
    );
  }

  async listContexts(
    input: JsonRpcMethodInput<ListContextsParams>,
  ): Promise<ListContextsResponse> {
    const { id, ...params } = input;
    return this.request<ListContextsParams, ListContextsResult>(
      RpcMethod.ContextsList,
      params as ListContextsParams,
      id,
    );
  }

  async clearContext(
    input: JsonRpcMethodInput<ClearContextParams>,
  ): Promise<ClearContextResponse> {
    const { id, ...params } = input;
    return this.request<ClearContextParams, ClearContextResult>(
      RpcMethod.ContextsClear,
      params as ClearContextParams,
      id,
    );
  }
}
