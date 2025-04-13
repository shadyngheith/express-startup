import { HTTP_STATUS } from "../config/constants";

export class HttpError extends Error {
  statusCode: number;
  code: string;
  details?: Record<string, any>;
  isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    code: string = "INTERNAL_SERVER_ERROR",
    details?: Record<string, any>,
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends HttpError {
  constructor(
    message: string = "Bad request",
    code: string = "BAD_REQUEST",
    details?: Record<string, any>
  ) {
    super(message, HTTP_STATUS.BAD_REQUEST, code, details);
  }
}

export class NotFoundError extends HttpError {
  constructor(
    message: string = "Resource not found",
    code: string = "NOT_FOUND",
    details?: Record<string, any>
  ) {
    super(message, HTTP_STATUS.NOT_FOUND, code, details);
  }
}

export class ValidationError extends HttpError {
  constructor(
    message: string = "Validation error",
    details?: Record<string, any>
  ) {
    super(
      message,
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
      "VALIDATION_ERROR",
      details
    );
  }
}

export class UnauthorizedError extends HttpError {
  constructor(
    message: string = "Unauthorized",
    code: string = "UNAUTHORIZED",
    details?: Record<string, any>
  ) {
    super(message, HTTP_STATUS.UNAUTHORIZED, code, details);
  }
}

export class ForbiddenError extends HttpError {
  constructor(
    message: string = "Forbidden",
    code: string = "FORBIDDEN",
    details?: Record<string, any>
  ) {
    super(message, HTTP_STATUS.FORBIDDEN, code, details);
  }
}

export class ConflictError extends HttpError {
  constructor(
    message: string = "Conflict",
    code: string = "CONFLICT",
    details?: Record<string, any>
  ) {
    super(message, HTTP_STATUS.CONFLICT, code, details);
  }
}

export class InternalServerError extends HttpError {
  constructor(
    message: string = "Internal server error",
    details?: Record<string, any>
  ) {
    super(
      message,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "INTERNAL_SERVER_ERROR",
      details,
      false
    );
  }
}
