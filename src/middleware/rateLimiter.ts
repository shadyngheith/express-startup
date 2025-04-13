import rateLimit from "express-rate-limit";
import { env } from "../config/environment";
import { ResponseBuilder } from "../utils/responseBuilder";
import { HTTP_STATUS } from "../config/constants";

/**
 * Creates a rate limiter middleware with configurable window and max requests
 */
export const createRateLimiter = (
  windowMs: number = env.RATE_LIMIT_WINDOW_MS,
  max: number = env.RATE_LIMIT_MAX,
  message: string = "Too many requests, please try again later."
) => {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      new ResponseBuilder(req.id)
        .withError("RATE_LIMIT_EXCEEDED", message, {
          retryAfter: Math.ceil(windowMs / 1000),
        })
        .send(res, HTTP_STATUS.TOO_MANY_REQUESTS);
    },
  });
};

// Default API rate limiter
export const apiLimiter = createRateLimiter();

// More restrictive rate limiter for auth routes
export const authLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // 5 requests
  "Too many login attempts, please try again later."
);
