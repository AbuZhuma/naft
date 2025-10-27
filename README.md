# ⚡ Naft

**Naft** — лёгкий и современный Node.js + TypeScript фреймворк для создания API с минимальным количеством кода и предсказуемой структурой.

Он сочетает **Express**, **Zod** и **TypeScript**, предоставляя удобный способ описания контроллеров, middleware и схем валидации.

---

## 🚀 Установка и создание проекта

### Установка глобально

```bash
npm install -g naft
```

### Создание нового проекта

```bash
npx naft create-app my-api
cd my-api
npm run dev
```

После запуска:

```
🚀 Server running on http://localhost:3000
```

---

## 📂 Структура проекта

```
my-api/
├─ src/
│  ├─ routes/
│  │  ├─ hello/
│  │  │  ├─ get.ts
│  │  │  └─ post.ts
│  │  ├─ user/
│  │  │  ├─ [id]/get.ts
│  │  │  ├─ [id]/put.ts
│  │  │  └─ middlewares.ts
│  │  ├─ get.users.[id].ts
│  │  ├─ put.users.[id].ts
│  │  └─ middlewares.ts
│  ├─ app.ts
│  └─ ...
├─ package.json
└─ tsconfig.json
```

---

## ⚙️ Быстрый старт

### `app.ts`

```ts
import { startServer } from "naft";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROUTES_PATH = path.join(__dirname, "routes");

startServer(3000, ROUTES_PATH);
```

---

## 🧩 Роутинг и контроллеры

Naft использует **file-based routing**, автоматически создавая маршруты на основе структуры файлов.

### 📘 Два способа объявления маршрутов

#### Вариант 1 — через папки (как в Next.js)

```
routes/
 └─ user/
     ├─ [id]/get.ts     →  GET /user/:id
     ├─ [id]/put.ts     →  PUT /user/:id
     └─ post.ts         →  POST /user
```

#### Вариант 2 — через имена файлов с точками

```
routes/
 ├─ get.users.[id].ts   →  GET /users/:id
 ├─ put.users.[id].ts   →  PUT /users/:id
 └─ post.users.ts       →  POST /users
```

> Оба формата поддерживаются одновременно.

---

### Пример простого роута

```ts
// routes/hello/get.ts
import { Request } from "express";
import { respond } from "naft";

export const controller = async (req: Request) => {
  return respond(200, { message: "Hello from Naft!" });
};

// GET http://localhost:3000/hello
```

---

## 🧱 Валидация через Zod

Naft встроенно поддерживает **Zod** для валидации `req.body`.

```ts
// routes/user/post.ts
import { z } from "zod";
import { Request } from "express";
import { respond } from "naft";

export const schema = z.object({
  name: z.string().min(1),
  age: z.number().int().positive(),
});

export const controller = async (req: Request) => {
  const { name, age } = req.body;
  return respond(200, { message: `Hello ${name}, you are ${age} years old!` });
};
```

Если валидация не проходит, Naft возвращает:

```json
{
  "message": "Validation error",
  "errors": [
    { "path": ["age"], "message": "Expected number, received string" }
  ]
}
```

---

## 🧩 Middleware

Поддерживаются **глобальные** и **локальные** middleware.

### Глобальные

```ts
// app.ts
import { startServer } from "naft";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROUTES_PATH = path.join(__dirname, "routes");

startServer(3000, ROUTES_PATH, { middlewares: [cors(), morgan("dev")] });
```

### Локальные для папки

```ts
// routes/middlewares.ts
import type { Request, Response, NextFunction } from "express";

export const middlewares = [
  (req: Request, _res: Response, next: NextFunction) => {
    console.log(`[ROUTE] ${req.method} ${req.path}`);
    next();
  },
];
```

### Только для одного роута

```ts
// routes/admin/get.ts
import { Request, Response, NextFunction } from "express";
import { respond } from "naft";

export const middlewares = [
  (req: Request, res: Response, next: NextFunction) => {
    if (req.headers["x-secret"] !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  },
];

export const controller = async () => respond(200, { message: "Welcome, admin!" });
```

---

## 🔁 Автоматическая регистрация маршрутов

`loadRoutesFromDir()` рекурсивно подключает:

* все маршруты (`get.ts`, `post.ts`, `put.ts`, `delete.ts`),
* локальные `middlewares.ts`,
* схемы Zod (`schema`).

---

## ⚙️ Функция `respond`

Упрощает возврат ответа:

```ts
import { respond } from "naft";

export const controller = async () => respond(200, { message: "OK" });
```

---

## ⚠️ Обработка ошибок

Naft автоматически обрабатывает:

* ошибки Zod,
* ошибки middleware,
* исключения в контроллерах.

```ts
throw { statusCode: 404, message: "User not found" };
```

Результат:

```json
{ "error": "User not found" }
```

---

## 🧰 CLI: создание проекта

```bash
npx naft create-app my-api
```

Фреймворк создаёт проект, устанавливает зависимости и выдаёт инструкции:

```
✅ Project "my-api" successfully created!
👉 cd my-api
👉 npm run dev
```

---

## 🧠 Философия

**Naft = Express без боли**:

* никакой магии, только структура, чистый TypeScript;
* автоматическая маршрутизация, валидация и обработка ошибок;
* простота и предсказуемость.

---

## 💡 Основные возможности

✅ File-based routing
✅ Поддержка Zod
✅ Middleware любого уровня
✅ TypeScript-first
✅ CLI для быстрого старта
✅ Два формата маршрутов:

* `user/[id]/get.ts`
* `get.users.[id].ts`

---

## 📜 License

MIT © 2025 Naft