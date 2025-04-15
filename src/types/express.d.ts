import { Response, Request } from "express";

declare module "express-serve-static-core" {
  interface Request {
    id: string;
    startTime: [number, number];
    locals: {
      user?: {
        id: string;
        [key: string]: any;
      };
      [key: string]: any;
    };
  }

  interface Response {
    success(data: any, statusCode?: number): void;
    created(data: any): void;
    noContent(): void;
    error(
      message: string,
      statusCode?: number,
      code?: string,
      details?: Record<string, any>
    ): void;
    locals: {
      [key: string]: any;
    };
  }
}
