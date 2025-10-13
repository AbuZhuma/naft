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
                res.status(result.status).send(result.data);
                return;
            }
            if (Buffer.isBuffer(result)) {
                res.end(result);
            }
            else if (typeof result === "string") {
                res.type("text/plain").send(result);
            }
            else if (typeof result === "number" || typeof result === "boolean") {
                res.type("text/plain").send(String(result));
            }
            else if (typeof result === "object") {
                res.json(result);
            }
            else {
                res.type("text/plain").send(String(result));
            }
        }
        catch (err) {
            if (!res.headersSent) {
                res
                    .status(err.statusCode || 500)
                    .json({ error: err.message || "Internal Server Error" });
            }
        }
    };
}
