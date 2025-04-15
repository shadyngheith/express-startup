import winston from "winston";
import { env } from "../config/environment";
import { Request, Response, NextFunction } from "express";
import { ILogger } from "./interfaces";

const { combine, timestamp, json, colorize, printf } = winston.format;

export class Logger implements ILogger {
  private logger: winston.Logger;

  constructor() {
    // Custom log format for development
    const devFormat = printf(({ level, message, timestamp, ...meta }) => {
      return `
      ${timestamp}
      ${level}
      ${JSON.stringify(message)}
      ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ""}`;
    });

    // Create logger with appropriate configuration
    this.logger = winston.createLogger({
      level: env.LOG_LEVEL,
      defaultMeta: { service: "api-service" },
      format: combine(
        timestamp(),
        env.NODE_ENV === "development" ? combine(colorize(), devFormat) : json()
      ),
      transports: [new winston.transports.Console()],
    });

    // Add file transports in production
    if (env.NODE_ENV === "production") {
      this.logger.add(
        new winston.transports.File({
          filename: "logs/error.log",
          level: "error",
          maxsize: 10485760, // 10MB
          maxFiles: 5,
        })
      );
      this.logger.add(
        new winston.transports.File({
          filename: "logs/combined.log",
          maxsize: 10485760, // 10MB
          maxFiles: 5,
        })
      );
    }
  }

  info(message: string, meta?: Record<string, any>): void {
    this.logger.info(message, meta);
  }

  error(message: string, meta?: Record<string, any>): void {
    this.logger.error(message, meta);
  }

  warn(message: string, meta?: Record<string, any>): void {
    this.logger.warn(message, meta);
  }

  debug(message: string, meta?: Record<string, any>): void {
    this.logger.debug(message, meta);
  }

  http(message: string, meta?: Record<string, any>): void {
    this.logger.http(message, meta);
  }

  verbose(message: string, meta?: Record<string, any>): void {
    this.logger.verbose(message, meta);
  }

  // HTTP request logger middleware
  httpLogger(req: Request, res: Response, next: NextFunction): void {
    const { method, url, ip, id } = req;

    req.startTime = process.hrtime();

    res.on("finish", () => {
      const [seconds, nanoseconds] = process.hrtime(req.startTime);
      const responseTime = (seconds * 1000 + nanoseconds / 1000000).toFixed(2);

      this.logger.error({
        requestId: id,
        method,
        url,
        status: res.statusCode,
        responseTime: `${responseTime}ms`,
        ip,
        userAgent: req.get("user-agent"),
      });
    });

    next();
  }
}

// Create a singleton instance
const loggerInstance = new Logger();

// Export the HTTP logger middleware
export const httpLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => loggerInstance.httpLogger(req, res, next);

// Export the logger instance for direct use
export default loggerInstance;
