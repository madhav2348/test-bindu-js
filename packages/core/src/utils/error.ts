/**
 * Base error
 */
// TODO: Add/update and implement error
abstract class BinduError extends Error {
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
  /*
   * 
   */
}

export class SyntaxError extends BinduError {
  /*
   * 
   */
}

export class ToolCallError extends BinduError {
  /*
   * 
   */
}

export class TimeoutError extends BinduError {
  /*
   * 
   */
}
