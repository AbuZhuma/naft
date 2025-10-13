import { RequestHandler } from "express";
interface StartServerOptions {
    middlewares?: RequestHandler[];
}
export declare function startServer(PORT: number | string, ROUTES_PATH: string, options?: StartServerOptions): Promise<import("express-serve-static-core").Express>;
export {};
//# sourceMappingURL=app.d.ts.map