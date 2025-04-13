import app from "./app";
import { env } from "./config/environment";
import logger from "./utils/logger";

const PORT = env.PORT;

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error({
    message: "Uncaught Exception",
    error: error.message,
    stack: error.stack,
  });

  // Exit with failure in case of uncaught exception
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error({
    message: "Unhandled Promise Rejection",
    reason,
    promise,
  });
});

// Start the server
const server = app.listen(PORT, () => {
  logger.info(`Server running in ${env.NODE_ENV} mode on port ${PORT}`);
  logger.info(`API available at http://localhost:${PORT}${env.API_PREFIX}`);
});

// Graceful shutdown
const gracefulShutdown = () => {
  logger.info("Shutting down gracefully...");
  server.close(() => {
    logger.info("Server closed");
    process.exit(0);
  });

  // Force close after 10s
  setTimeout(() => {
    logger.error("Forcing shutdown after timeout");
    process.exit(1);
  }, 10000);
};

// Listen for termination signals
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

export default server;
