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
  req.id = req.id || (req.headers["x-request-id"] as string) || uuidv4();

  req.locals = req.locals || {};

  res.setHeader("x-request-id", req.id);

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
