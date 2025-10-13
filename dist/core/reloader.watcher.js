import fs from "fs";
import path from "path";
import { registerRoute } from "./route.generator.js";
import { validateBody } from "../middlewares/zod.validator.js";
export function hotReloadRoutes(router, dir, prefix = "") {
    function convertPathSegment(segment) {
        return segment.startsWith("[") && segment.endsWith("]")
            ? `:${segment.slice(1, -1)}`
            : segment;
    }
    function watchDir(directory, currentPrefix) {
        if (!fs.existsSync(directory))
            return;
        fs.readdirSync(directory).forEach((file) => {
            const fullPath = path.join(directory, file);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                const newPrefix = path.join(currentPrefix, convertPathSegment(file)).replace(/\\/g, "/");
                watchDir(fullPath, newPrefix);
                return;
            }
            if (!file.endsWith(".js") && !file.endsWith(".ts"))
                return;
            fs.watch(fullPath, async (eventType) => {
                if (eventType !== "change")
                    return;
                try {
                    // Импортируем файл с query-параметром для принудительного обновления
                    const routeModule = await import(`file://${path.resolve(fullPath)}?update=${Date.now()}`);
                    const handler = routeModule.controller;
                    const middlewares = routeModule.middlewares ? [...routeModule.middlewares] : [];
                    if (routeModule.schema)
                        middlewares.push(validateBody(routeModule.schema));
                    if (typeof handler !== "function")
                        return;
                    const routePath = "/" + currentPrefix.replace(/\\/g, "/");
                    const method = (path.basename(file, path.extname(file)).toUpperCase() || "GET");
                    // Берём стэк роутера
                    const stack = router.stack || (router._router && router._router.stack);
                    if (!stack)
                        return;
                    // Фильтруем старый слой по пути и методу
                    router.stack = stack.filter((layer) => {
                        if (!layer.route)
                            return true; // middleware оставляем
                        const methods = layer.route.methods;
                        return !(layer.route.path === routePath && methods[method.toLowerCase()]);
                    });
                    // Регистрируем новый маршрут
                    registerRoute(router, {
                        path: routePath,
                        method,
                        callback: handler,
                        middlewares,
                    });
                    console.log(`[HOT RELOAD] ✅ ${method} ${routePath} обновлён`);
                }
                catch (err) {
                    console.error(`[HOT RELOAD ERROR] ${fullPath}`, err);
                }
            });
        });
    }
    watchDir(dir, prefix);
}
