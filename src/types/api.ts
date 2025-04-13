export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ApiMetadata;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  stack?: string;
}

export interface ApiMetadata {
  timestamp: string;
  requestId: string;
  pagination?: PaginationMetadata;
}

export interface PaginationMetadata {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ApiQuery {
  page?: number;
  limit?: number;
  sort?: string;
  filter?: Record<string, any>;
  fields?: string;
}
