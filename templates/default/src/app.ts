import { startServer } from "naft";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROUTES_PATH = path.join(__dirname, "routes");

const bootstrap = async () => {
      const app = startServer(3005, ROUTES_PATH);
} 

bootstrap()