import { Router } from "express";
import { AsyncHandler, Middleware } from "./controller.wrapper.js";
export type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";
export interface RouteGenerator {
    path: string;
    method?: HTTPMethod;
    callback: AsyncHandler;
    middlewares?: Middleware[];
}
export declare function registerRoute(router: Router, route: RouteGenerator): void;
//# sourceMappingURL=route.generator.d.ts.map