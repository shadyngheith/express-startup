import { Response } from "express";
import { ApiResponse, ApiMetadata } from "../types/api";
import { HTTP_STATUS } from "../config/constants";

/**
 * Builds a standardized API response
 */
export class ResponseBuilder<T = any> {
  private response: ApiResponse<T> = {
    success: true,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: "",
    },
  };

  constructor(requestId: string) {
    this.response.meta!.requestId = requestId;
  }

  /**
   * Add data to the response
   */
  withData(data: T): ResponseBuilder<T> {
    this.response.data = data;
    return this;
  }

  /**
   * Add error information to the response
   */
  withError(
    code: string,
    message: string,
    details?: Record<string, any>
  ): ResponseBuilder<T> {
    this.response.success = false;
    this.response.error = {
      code,
      message,
      details,
    };
    return this;
  }

  /**
   * Add metadata to the response
   */
  withMeta(meta: Partial<ApiMetadata>): ResponseBuilder<T> {
    this.response.meta = {
      ...this.response.meta,
      ...meta,
    };
    return this;
  }

  /**
   * Add pagination metadata
   */
  withPagination(
    total: number,
    page: number,
    limit: number
  ): ResponseBuilder<T> {
    const pages = Math.ceil(total / limit);

    if (!this.response.meta) {
      this.response.meta = {
        timestamp: new Date().toISOString(),
        requestId: "",
      };
    }

    this.response.meta.pagination = {
      total,
      page,
      limit,
      pages,
    };

    return this;
  }

  /**
   * Send the response with the appropriate status code
   */
  send(res: Response, statusCode: number = HTTP_STATUS.OK): void {
    res.status(statusCode).json(this.response);
  }
}

/**
 * Response helper functions
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode: number = HTTP_STATUS.OK
): void => {
  const requestId = res.req.id || "unknown";
  new ResponseBuilder<T>(requestId).withData(data).send(res, statusCode);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  code: string = "ERROR",
  details?: Record<string, any>
): void => {
  const requestId = res.req.id || "unknown";
  new ResponseBuilder(requestId)
    .withError(code, message, details)
    .send(res, statusCode);
};
