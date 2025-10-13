import { Request, Response, NextFunction } from "express";

export type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<any> | any;
export type Middleware = (req: Request, res: Response, next: NextFunction) => void | Promise<void>;

export type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface RouteGenerator {
  path: string;
  method?: HTTPMethod;
  callback: AsyncHandler;
  middlewares?: Middleware[];
}
