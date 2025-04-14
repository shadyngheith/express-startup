import express, { Application, Request, Response } from "express";
import morgan from "morgan";
import { securityHeaders, corsMiddleware } from "../middleware/securityHeaders";
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
  if (env.NODE_ENV === "development") {
    app.use(morgan("dev")); // Simple console logging for development
  } else {
    app.use(httpLogger); // Structured logging for production
  }

  // Performance: Enable compression
  // app.use(
  //   compression({
  //     // Filter out small responses or already compressed formats
  //     filter: (req, res) => {
  //       if (req.headers["x-no-compression"]) {
  //         return false;
  //       }
  //       return compression.filter(req, res);
  //     },
  //     // Compression level (0-9), higher = more compression but slower
  //     level: 6,
  //   })
  // );

  // Health check endpoint
  app.get("/health", (req: Request, res: Response) => {
    const healthData = {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: env.NODE_ENV,
    };
    res.success(healthData);
  });

  // API information endpoint
  app.get(`${env.API_PREFIX}`, (req: Request, res: Response) => {
    res.success({
      name: "Express Startup API",
      version: "1.0.0",
      environment: env.NODE_ENV,
      apiPrefix: env.API_PREFIX,
    });
  });

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
