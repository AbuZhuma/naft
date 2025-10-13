import fs from "fs";
import path from "path";
import { Router } from "express";
import { loadRoutesFromDir } from "./routes.loader.js";
const watchedRoutes = [];
export function watchRoutes(app, dir, interval = 300) {
    if (!fs.existsSync(dir))
        return;
    const files = [];
    function scanDir(currentDir) {
        const items = fs.readdirSync(currentDir);
        for (const item of items) {
            const fullPath = path.join(currentDir, item);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory())
                scanDir(fullPath);
            else
                files.push(fullPath);
        }
    }
    scanDir(dir);
    files.forEach((file) => {
        let timeout;
        fs.watchFile(file, { interval }, async () => {
            clearTimeout(timeout);
            timeout = setTimeout(async () => {
                try {
                    console.log(`[HOT RELOAD] 🔄 Файл изменен: ${file}`);
                    // удаляем старый Router для этого файла
                    const existing = watchedRoutes.find((r) => r.file === file);
                    if (existing) {
                        app._router.stack = app._router.stack.filter((layer) => layer.handle !== existing.router);
                        watchedRoutes.splice(watchedRoutes.indexOf(existing), 1);
                    }
                    const newRouter = Router();
                    const routeDir = path.dirname(file);
                    const prefix = path.relative(dir, routeDir).replace(/\\/g, "/");
                    await loadRoutesFromDir(newRouter, routeDir, prefix);
                    app.use(newRouter);
                    watchedRoutes.push({ routePath: "", router: newRouter, file });
                    console.log(`[HOT RELOAD] ✅ Маршрут обновлен: ${file}`);
                }
                catch (err) {
                    console.error(`[HOT RELOAD] ❌ Ошибка загрузки ${file}`, err);
                }
            }, 100); // debounce
        });
    });
}
