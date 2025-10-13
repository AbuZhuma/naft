import fs from "fs";
import path from "path";
import { registerRoute } from "./route.generator.js";
import { ALLOWED_METHODS } from "../utils/constants.js";
import { validateBody } from "../middlewares/zod.validator.js";
function convertPathSegment(segment) {
    return segment.startsWith("[") && segment.endsWith("]")
        ? `:${segment.slice(1, -1)}`
        : segment;
}
export async function loadRoutesFromDir(router, dir, prefix = "") {
    if (!fs.existsSync(dir))
        return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            const newPrefix = path.join(prefix, convertPathSegment(file)).replace(/\\/g, "/");
            await loadRoutesFromDir(router, fullPath, newPrefix);
            continue;
        }
        const baseName = path.basename(file, path.extname(file)).toLowerCase();
        if (!ALLOWED_METHODS.includes(baseName))
            continue;
        const method = baseName.toUpperCase();
        const routeModule = await import(fullPath);
        const handler = routeModule.controller;
        const middlewares = routeModule.middlewares || [];
        if (routeModule.schema) {
            middlewares.push(validateBody(routeModule.schema));
        }
        if (typeof handler !== "function") {
            console.warn(`[ROUTE LOADER] ⚠️ ${file} не экспортирует функцию controller`);
            continue;
        }
        const routePath = prefix ? "/" + prefix : "/";
        registerRoute(router, {
            path: routePath,
            method,
            callback: handler,
            middlewares,
        });
        console.log(`[ROUTE LOADER] ✅ ${method} ${routePath}`);
    }
}
