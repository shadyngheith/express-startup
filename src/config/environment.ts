import dotenv from "dotenv";
import path from "path";

// Load environment variables based on NODE_ENV
const envFile =
  process.env.NODE_ENV === "production"
    ? ".env"
    : `.env.${process.env.NODE_ENV || "development"}`;
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

interface Environment {
  NODE_ENV: string;
  PORT: number;
  API_PREFIX: string;
  LOG_LEVEL: string;
  CORS_ORIGIN: string;
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX: number;
  // Add other environment variables as needed
}

// Configure and validate environment variables with defaults
export const env: Environment = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "3000", 10),
  API_PREFIX: process.env.API_PREFIX || "/api",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
  RATE_LIMIT_WINDOW_MS: parseInt(
    process.env.RATE_LIMIT_WINDOW_MS || "60000",
    10
  ),
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),
};

// Validate required environment variables in production
export const validateEnv = (): void => {
  if (env.NODE_ENV === "production") {
    const requiredEnvVars: Array<keyof Environment> = [
      "NODE_ENV",
      "PORT",
      "API_PREFIX",
      // Add other required vars
    ];

    const missingEnvVars = requiredEnvVars.filter((key) => !env[key]);

    if (missingEnvVars.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missingEnvVars.join(", ")}`
      );
    }
  }
};
