import { Request, Response, NextFunction } from "express";
import { AsyncHandler, Middleware } from "../types.js";
export declare function wrapController(handler: AsyncHandler, middlewares?: Middleware[]): (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=controller.wrapper.d.ts.map