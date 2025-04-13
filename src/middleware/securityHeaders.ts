import helmet from "helmet";
import cors from "cors";
import { env } from "../config/environment";

/**
 * Configure security headers with helmet
 */
export const securityHeaders = helmet({
  contentSecurityPolicy: env.NODE_ENV === "production",
  crossOriginEmbedderPolicy: env.NODE_ENV === "production",
  xssFilter: true,
  noSniff: true,
  hidePoweredBy: true,
});

/**
 * Configure CORS settings
 */
export const corsMiddleware = cors({
  origin: env.CORS_ORIGIN,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "x-request-id"],
  exposedHeaders: ["x-request-id"],
  credentials: true,
  maxAge: 86400, // 24 hours
});
