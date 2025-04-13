import configureExpress, { configureErrorHandling } from "./config/express";
import { validateEnv } from "./config/environment";
import logger from "./utils/logger";

// Validate environment variables
try {
  validateEnv();
} catch (error) {
  logger.error(`Environment validation failed: ${error.message}`);
  process.exit(1);
}

// Create and configure the Express app
const app = configureExpress();

// Register API routes here
// app.use('/api/v1/users', userRoutes);
// app.use('/api/v1/products', productRoutes);

// Configure error handling (must be after route registration)
configureErrorHandling(app);

export default app;
