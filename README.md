# ⚡ Naft

**Naft** is a lightweight and expressive Node.js + TypeScript framework for building modern APIs with minimal effort.

It provides an intuitive structure for controllers, middleware, and validation using Zod — all designed to keep your code clean and predictable.


## 🚀 Installation

```bash
npm install naft
````

---

## ⚡ Quick Example

```ts
//app.ts
import { startServer } from "naft";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROUTES_PATH = path.join(__dirname, "routes");

const app = startServer(3000, ROUTES_PATH);
```

---

## 🧩 Example Route

```ts
//routes/hello/get.ts
import type { Request } from "express";
import { respond } from "naft";

export const controller = async (req: Request) => {
  return respond(200, { message: "Hello from Naft!" });
};

// request to - GET http://localhost:3000/hello
```

### With Validation

```ts
//routes/hello/post.ts
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

// request to - POST http://localhost:3000/hello
```

---

## 💡 Features

* Simple file-based routing
* Built-in Zod validation
* Async controllers with error handling
* Express middleware support
* TypeScript-first design

---

## 🧠 Philosophy

Naft focuses on clarity and simplicity — no magic, just structure.
You write clean TypeScript, and Naft handles routing, validation, and responses.

---

## 📜 License

MIT © 2025 Naft
