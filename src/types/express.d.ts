import { Express } from "express-serve-static-core";

declare global {
  namespace Express {
    interface Request {
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
      locals: {
        [key: string]: any;
      };
    }
  }
}
