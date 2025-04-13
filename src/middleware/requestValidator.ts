import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationChain } from "express-validator";
import { ValidationError } from "../types/error";

/**
 * Validates a request against provided validation chains
 * @param validations - Array of validation chains from express-validator
 */
export const validate = (validations: ValidationChain[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // Execute all validations
    await Promise.all(validations.map((validation) => validation.run(req)));

    // Check for validation errors
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      return next();
    }

    // Format validation errors for consistent response
    const formattedErrors = errors.array().reduce((acc, error) => {
      const { param, msg, value } = error;
      acc[param] = acc[param] || [];
      acc[param].push({ message: msg, value });
      return acc;
    }, {});

    // Throw a ValidationError to be caught by the error handler
    next(new ValidationError("Validation failed", formattedErrors));
  };
};
