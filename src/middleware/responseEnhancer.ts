import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { sendSuccess, sendError } from "../utils/responseBuilder";
import { HTTP_STATUS } from "../config/constants";

/**
 * Enhances the response object with standardized methods
 */
export const responseEnhancer = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Enhance response with helper methods
  res.success = function (data: any, statusCode: number = HTTP_STATUS.OK) {
    sendSuccess(this, data, statusCode);
  };

  res.created = function (data: any) {
    sendSuccess(this, data, HTTP_STATUS.CREATED);
  };

  res.noContent = function () {
    this.status(HTTP_STATUS.NO_CONTENT).end();
  };

  res.error = function (
    message: string,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    code: string = "ERROR",
    details?: Record<string, any>
  ) {
    sendError(this, message, statusCode, code, details);
  };

  next();
};

// Add types to express Response
declare global {
  namespace Express {
    interface Response {
      success(data: any, statusCode?: number): void;
      created(data: any): void;
      noContent(): void;
      error(
        message: string,
        statusCode?: number,
        code?: string,
        details?: Record<string, any>
      ): void;
    }
  }
}
