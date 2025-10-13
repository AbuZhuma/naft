import { ZodObject, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

export class ValidationError extends Error {
  public details: any;
  constructor(issues: any) {
    super("Validation error");
    this.details = issues;
  }
}

export function validateBody(schema: ZodObject<any>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        next(new ValidationError(err.issues));
        return;
      }
      next(err);
    }
  };
}
