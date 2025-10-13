import { Router } from "express";
import { wrapController } from "./controller.wrapper.js";
import { RouteGenerator } from "../types.js";

export function registerRoute(router: Router, route: RouteGenerator) {
  const method = (route.method || "POST").toLowerCase() as "get" | "post" | "put" | "delete";
  const handler = wrapController(route.callback, route.middlewares);
  (router as any)[method](route.path, handler);
}
