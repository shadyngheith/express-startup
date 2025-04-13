import express, { Application } from "express";
import morgan from "morgan";
import compression from "compression";
import { securityHeaders, corsMiddleware } from "../middleware/securityHeaders";
import { apiLimiter } from "../middleware/rateLimiter";
import { responseEnhancer } from "../middleware/responseEnhancer";
import { httpLogger } from "../utils/logger";
import { errorHandler, notFoundHandler } from "../middleware/errorHandler";
import { env } from "./environment";

/**
 * Configures the Express application with all middleware and settings
 */
export default function configureExpress(): Application {
  const app: Application = express();

  // Trust the first proxy if behind a reverse proxy
  if (env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
  }

  // Basic middleware
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Security middleware
  app.use(securityHeaders);
  app.use(corsMiddleware);

  // Add request ID and enhanced response methods
  app.use(responseEnhancer);

  // Logging
  app.use(morgan("dev")); // Simple console logging for development
  app.use(httpLogger); // Structured logging for production

  // Compression
  app.use(compression());

  // Rate limiting for API routes
  app.use(`${env.API_PREFIX}`, apiLimiter);

  // Health check endpoint (unrestricted by rate limits)
  app.get("/health", (req, res) => res.success({ status: "ok" }));

  return app;
}

/**
 * Configures error handling for the Express application
 * Must be called after all route registrations
 */
export function configureErrorHandling(app: Application): void {
  // Handle 404s
  app.use(notFoundHandler);

  // Global error handler - must be the last middleware
  app.use(errorHandler);
}
