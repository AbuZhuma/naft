import { wrapController } from "./controller.wrapper.js";
export function registerRoute(router, route) {
    const method = (route.method || "POST").toLowerCase();
    const handler = wrapController(route.callback, route.middlewares);
    router[method](route.path, handler);
}
