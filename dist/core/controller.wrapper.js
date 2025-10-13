import { ValidationError } from "../middlewares/zod.validator.js";
import { respond } from "../utils/helpers.js";
export function wrapController(handler, middlewares = []) {
    return async (req, res, next) => {
        try {
            for (const mw of middlewares) {
                await new Promise((resolve, reject) => {
                    mw(req, res, (err) => (err ? reject(err) : resolve()));
                });
                if (res.headersSent)
                    return;
            }
            const result = await handler(req, res, next);
            if (res.headersSent || result === undefined)
                return;
            if (result?.__type === "response") {
                return res.status(result.status).send(result.data);
            }
            if (Buffer.isBuffer(result))
                return res.end(result);
            if (typeof result === "string")
                return res.type("text/plain").send(result);
            if (typeof result === "number" || typeof result === "boolean")
                return res.type("text/plain").send(String(result));
            return res.json(result);
        }
        catch (err) {
            if (!res.headersSent) {
                if (err instanceof ValidationError) {
                    const resp = respond(400, { message: err.message, errors: err.details });
                    return res.status(resp.status).json(resp.data);
                }
                res.status(err.statusCode || 500).json({
                    error: err.message || "Internal Server Error",
                });
            }
        }
    };
}
