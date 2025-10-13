import type { Request } from "express";
import { respond } from "naft";    

export const controller = async (req: Request) => {
  return respond(200, { message: "Hello from naft!" });
};
