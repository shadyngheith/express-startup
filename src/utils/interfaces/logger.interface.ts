/**
 * Logger interface defining methods that a logger class must implement
 */
export interface ILogger {
  /**
   * Log information messages
   * @param message Message to log
   * @param meta Additional metadata to include
   */
  info(message: string, meta?: Record<string, any>): void;

  /**
   * Log error messages
   * @param message Message to log
   * @param meta Additional metadata to include
   */
  error(message: string, meta?: Record<string, any>): void;

  /**
   * Log warning messages
   * @param message Message to log
   * @param meta Additional metadata to include
   */
  warn(message: string, meta?: Record<string, any>): void;

  /**
   * Log debug messages
   * @param message Message to log
   * @param meta Additional metadata to include
   */
  debug(message: string, meta?: Record<string, any>): void;

  /**
   * Log HTTP messages
   * @param message Message to log
   * @param meta Additional metadata to include
   */
  http(message: string, meta?: Record<string, any>): void;

  /**
   * Log verbose messages
   * @param message Message to log
   * @param meta Additional metadata to include
   */
  verbose(message: string, meta?: Record<string, any>): void;
}
