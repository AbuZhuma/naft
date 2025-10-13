import { ZodObject } from "zod";
import { Request, Response, NextFunction } from "express";
export declare class ValidationError extends Error {
    details: any;
    constructor(issues: any);
}
export declare function validateBody(schema: ZodObject<any>): (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=zod.validator.d.ts.map