import type { Request } from "express";
import { z } from "zod";
import { respond } from "naft";

export const schema = z.object({
  name: z.string().min(1),
  age: z.number().int().positive(),
});

export const controller = async (req: Request) => {
  const { name, age } = req.body;

  return respond(200, {
    message: `Hello ${name}, you are ${age} years old!`,
  });
};
