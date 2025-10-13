import { Request, Response, NextFunction } from "express";
export type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<any> | any;
export type Middleware = (req: Request, res: Response, next: NextFunction) => void | Promise<void>;
export declare function wrapController(handler: AsyncHandler, middlewares?: Middleware[]): (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=controller.wrapper.d.ts.map