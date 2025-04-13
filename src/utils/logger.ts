import winston from "winston";
import { env } from "../config/environment";

const { combine, timestamp, json, colorize, printf } = winston.format;

// Custom log format for development
const devFormat = printf(({ level, message, timestamp, ...meta }) => {
  return `${timestamp} ${level}: ${message} ${
    Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ""
  }`;
});

// Create logger with appropriate configuration
const logger = winston.createLogger({
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
  logger.add(
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      maxsize: 10485760, // 10MB
      maxFiles: 5,
    })
  );
  logger.add(
    new winston.transports.File({
      filename: "logs/combined.log",
      maxsize: 10485760, // 10MB
      maxFiles: 5,
    })
  );
}

// HTTP request logger
export const httpLogger = (req, res, next) => {
  const { method, url, ip, id } = req;

  req.startTime = process.hrtime();

  res.on("finish", () => {
    const [seconds, nanoseconds] = process.hrtime(req.startTime);
    const responseTime = (seconds * 1000 + nanoseconds / 1000000).toFixed(2);

    logger.http({
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
};

export default logger;
