import { Request, Response, NextFunction } from "express";
import { HttpError } from "../types/error";
import logger from "../utils/logger";
import { HTTP_STATUS, ERROR_MESSAGES } from "../config/constants";
import { env } from "../config/environment";
import { ResponseBuilder } from "../utils/responseBuilder";

/**
 * Handles all application errors and sends appropriate responses
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log the error
  logger.error({
    message: `Error processing request: ${err.message}`,
    stack: err.stack,
    requestId: req.id,
    path: req.path,
    method: req.method,
  });

  // If the error is expected (operational)
  if (err instanceof HttpError) {
    let details = err.details || {};

    // Only include stack trace in development
    if (env.NODE_ENV === "development" && err.stack) {
      details = {
        ...details,
        stack: err.stack.split("\n"),
      };
    }

    new ResponseBuilder(req.id)
      .withError(err.code, err.message, details)
      .send(res, err.statusCode);
    return;
  }

  // For unexpected errors, don't leak error details in production
  const errorMessage =
    env.NODE_ENV === "production"
      ? ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      : err.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR;

  const errorDetails =
    env.NODE_ENV === "production"
      ? undefined
      : { stack: err.stack?.split("\n") };

  new ResponseBuilder(req.id)
    .withError("INTERNAL_SERVER_ERROR", errorMessage, errorDetails)
    .send(res, HTTP_STATUS.INTERNAL_SERVER_ERROR);
};

/**
 * Handles 404 Not Found errors for routes that don't exist
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  new ResponseBuilder(req.id)
    .withError("NOT_FOUND", `Route not found: ${req.method} ${req.originalUrl}`)
    .send(res, HTTP_STATUS.NOT_FOUND);
};
