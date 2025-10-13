import fs from "fs";
import path from "path";
import { Router } from "express";
import { Middleware } from "../types.js";
import { registerRoute } from "./route.generator.js";
import { ALLOWED_METHODS } from "../utils/constants.js";
import { validateBody } from "../middlewares/zod.validator.js";

type HttpMethod = typeof ALLOWED_METHODS[number];

function convertPathSegment(segment: string) {
  return segment.startsWith("[") && segment.endsWith("]")
    ? `:${segment.slice(1, -1)}`
    : segment;
}

export async function loadRoutesFromDir(
  router: Router,
  dir: string,
  prefix = "",
  parentMiddlewares: Middleware[] = []
) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);

  let currentMiddlewares = parentMiddlewares;
  const middlewareFile = files.find(f => f.toLowerCase() === "middlewares.ts");
  if (middlewareFile) {
    const mwModule = await import(path.join(dir, middlewareFile));
    if ("middlewares" in mwModule && Array.isArray(mwModule.middlewares)) {
      currentMiddlewares = mwModule.middlewares;
    }
  }

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      const newPrefix = path.join(prefix, convertPathSegment(file)).replace(/\\/g, "/");
      await loadRoutesFromDir(router, fullPath, newPrefix, currentMiddlewares);
      continue;
    }

    const fileName = path.basename(file, path.extname(file)).toLowerCase();
    if (fileName === "middlewares") continue;

    const parts = fileName.split(".");
    const methodPart = parts.shift(); 
    if (!ALLOWED_METHODS.includes(methodPart as HttpMethod)) continue;

    const method = methodPart?.toUpperCase() as "GET" | "POST" | "PUT" | "DELETE";

    const pathSegments = parts.map(convertPathSegment);

    const routeModule = await import(fullPath);
    const handler = routeModule.controller;

    if (typeof handler !== "function") {
      console.warn(`[ROUTE LOADER] ⚠️ ${file} не экспортирует функцию controller`);
      continue;
    }

    const routeMiddlewares: Middleware[] = [...currentMiddlewares];
    if (routeModule.middlewares) routeMiddlewares.push(...routeModule.middlewares);
    if (routeModule.schema) routeMiddlewares.push(validateBody(routeModule.schema));

    const routePath = "/" + [prefix, ...pathSegments].filter(Boolean).join("/");

    registerRoute(router, {
      path: routePath,
      method,
      callback: handler,
      middlewares: routeMiddlewares,
    });

    console.log(`[ROUTE LOADER] ✅ ${method} ${routePath}`);
  }
}
