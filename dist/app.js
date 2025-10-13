import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { loadRoutesFromDir } from "./core/routes.loader.js";
dotenv.config();
export async function startServer(PORT, ROUTES_PATH, options = {}) {
    const app = express();
    app.use(express.json());
    app.use(cors());
    if (options.middlewares && options.middlewares.length) {
        options.middlewares.forEach((mw) => app.use(mw));
    }
    await loadRoutesFromDir(app, ROUTES_PATH);
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
    return app;
}
