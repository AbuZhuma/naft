import fs from "fs";
import path from "path";
import { registerRoute } from "./route.generator.js";
const ALLOWED_METHODS = ["get", "post", "put", "delete"];
function convertPathSegment(segment) {
    if (segment.startsWith("[") && segment.endsWith("]")) {
        return `:${segment.slice(1, -1)}`;
    }
    return segment;
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
        if (typeof handler !== "function") {
            console.warn(`[ROUTE LOADER] ${file} не экспортирует функцию controller`);
            continue;
        }
        const route = {
            path: prefix ? "/" + prefix : "/",
            method,
            callback: handler,
            middlewares,
        };
        registerRoute(router, route);
        console.log(`[ROUTE LOADER] ${method} ${prefix || "/"}`);
    }
}
