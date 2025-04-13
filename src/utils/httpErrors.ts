import {
  HttpError,
  BadRequestError,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  InternalServerError,
} from '../types/error';

export {
  HttpError,
  BadRequestError,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  InternalServerError,
};

/**
 * Helper to create and throw HTTP errors
 */
export const throwHttpError = (
  message: string,
  statusCode: number,
  code?: string,
  details?: Record<string, any>
): never => {
  throw new HttpError(message, statusCode, code, details);
};

/**
 * Helper functions to throw specific errors
 */
export const throwBadRequest = (
  message = 'Bad request',
  code = 'BAD_REQUEST',
  details?: Record<string, any>
): never => {
  throw new BadRequestError(message, code, details);
};

export const throwNotFound = (
  message = 'Resource not found',
  code = 'NOT_FOUND',
  details?: Record<string, any>
): never => {
  throw new NotFoundError(message, code, details);
};

export const throwValidation = (
  message = 'Validation error',
  details?: Record<string, any>
): never => {
  throw new ValidationError(message, details);
};

export const throwUnauthorized = (
  message = 'Unauthorized',
  code = 'UNAUTHORIZED',
  details?: Record<string, any>
): never => {
  throw new UnauthorizedError(message, code, details);
};

export const throwForbidden = (
  message = 'Forbidden',
  code = 'FORBIDDEN',
  details?: Record<string, any>
): never => {
  throw new ForbiddenError(message, code, details);
};

export const throwConflict = (
  message = 'Conflict',
  code = 'CONFLICT',
  details?: Record<string, any>
): never => {
  throw new ConflictError(message, code, details);
};

export const throwInternal = (
  message = 'Internal server error',
  details?: Record<string, any>
): never => {
  throw new InternalServerError(message, details);
};
