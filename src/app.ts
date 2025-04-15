import { Application, Request, Response } from "express";
import configureExpress, { configureErrorHandling } from "./config/express";
import { validateEnv } from "./config/environment";
import logger from "./utils/logger";

// Validate environment variables
try {
  validateEnv();
} catch (error: any) {
  logger.error(`Environment validation failed: ${error.message}`);
  process.exit(1);
}

// Create and configure the Express app
const app = configureExpress();

// Register API routes here
// app.use('/api/v1/users', userRoutes);
// app.use('/api/v1/products', productRoutes);
app.get("/api/test", async (req: Request, res: Response) => {
  // res.success({ message: "Hello World" });
  res.error("Hello World", 500, "ERROR", { message: "Hello World" });
});

// Configure error handling (must be after route registration)
configureErrorHandling(app);

export default app;
