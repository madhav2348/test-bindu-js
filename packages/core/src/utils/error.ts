/**
 * Base error
 */
export abstract class BinduError extends Error {
  constructor(
    public code: number,
    message: string,
    public data?: unknown,
  ) {
    super(message);
    this.name = "BinduError";
  }
}

export class NetworkError extends BinduError {
  constructor(code: number, message: string, data?: unknown) {
    super(code, message, data);
    this.name = "NetworkError";
  }
}

export class JsonRpcError extends BinduError {
  constructor(code: number, message: string, data?: unknown) {
    super(code, message, data);
    this.name = "JsonRpcError";
  }
}

export class InvalidParamsError extends JsonRpcError {
  constructor(code: number, message: string, data?: unknown) {
    super(code, message, data);
    this.name = "InvalidParamsError";
  }
}

export class TaskNotFoundError extends JsonRpcError {
  constructor(code: number, message: string, data?: unknown) {
    super(code, message, data);
    this.name = "TaskNotFoundError";
  }
}

export class DidResolveError extends BinduError {
  constructor(code: number, message: string, data?: unknown) {
    super(code, message, data);
    this.name = "DidResolveError";
  }
}

export class NegotiationError extends BinduError {
  constructor(code: number, message: string, data?: unknown) {
    super(code, message, data);
    this.name = "NegotiationError";
  }
}

// export class ToolCallError extends BinduError {
//   constructor(code: number, message: string, data?: unknown) {
//     super(code, message, data);
//     this.name = "ToolCallError";
//   }
// }

export class TimeoutError extends BinduError {
  constructor(code: number, message: string, data?: unknown) {
    super(code, message, data);
    this.name = "TimeoutError";
  }
}

export class AuthenticationError extends BinduError{
   constructor(code: number, message: string, data?: unknown) {
    super(code, message, data);
    this.name = "AuthenticationError";
  }
}

export class SkillDetailError extends BinduError{
   constructor(code: number, message: string, data?: unknown) {
    super(code, message, data);
    this.name = "SkillDetailError";
  }
}
export class SkillDocumentationError extends BinduError{
   constructor(code: number, message: string, data?: unknown) {
    super(code, message, data);
    this.name = "SkillDocumentationError";
  }
}
export class PaymentSessionError extends BinduError{
   constructor(code: number, message: string, data?: unknown) {
    super(code, message, data);
    this.name = "SkillDocumentationError";
  }
}
export class PaymentStatusError extends BinduError{
   constructor(code: number, message: string, data?: unknown) {
    super(code, message, data);
    this.name = "SkillDocumentationError";
  }
}
export class PaymentCaptureError extends BinduError{
   constructor(code: number, message: string, data?: unknown) {
    super(code, message, data);
    this.name = "SkillDocumentationError";
  }
}