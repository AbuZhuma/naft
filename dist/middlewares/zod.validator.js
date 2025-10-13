import { ZodError } from "zod";
export class ValidationError extends Error {
    constructor(issues) {
        super("Validation error");
        this.details = issues;
    }
}
export function validateBody(schema) {
    return (req, _res, next) => {
        try {
            req.body = schema.parse(req.body);
            next();
        }
        catch (err) {
            if (err instanceof ZodError) {
                next(new ValidationError(err.issues));
                return;
            }
            next(err);
        }
    };
}
