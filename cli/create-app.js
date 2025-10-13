import fs from "fs-extra"; 
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createApp(projectName) {
  if (!projectName) {
    console.error("❌ Enter the name of the project: npx naft create-app my-app");
    process.exit(1);
  }

  const projectPath = path.resolve(process.cwd(), projectName);
  if (fs.existsSync(projectPath)) {
    console.error("❌ The folder already exists.:", projectPath);
    process.exit(1);
  }

  console.log(`📦 Creating a project "${projectName}"...`);

  const templatePath = path.join(__dirname, "../templates/default");
  await fs.copy(templatePath, projectPath); 

  const packageJson = {
    name: projectName,
    version: "1.0.0",
    type: "module",
    scripts: { dev: "ts-node src/app.ts" },
    dependencies: {
      naft: "file:../naft",
      express: "^4.19.2",
      cors: "^2.8.5",
      dotenv: "^16.4.5"
    },
    devDependencies: {
      typescript: "^5.6.3",
      zod: "^4.1.12",
      "ts-node": "^10.9.2",
      "@types/node": "^20.5.7",
      "@types/express": "^4.17.21",
      "@types/cors": "^2.8.13"
    }
  };

  fs.writeFileSync(path.join(projectPath, "package.json"), JSON.stringify(packageJson, null, 2));

  console.log("📥 Establishing dependencies...");
  execSync("npm install", { stdio: "inherit", cwd: projectPath });

  console.log(`✅ Project "${projectName}" successfully created!`);
  console.log(`\n👉 cd ${projectName}\n👉 npm run dev\n`);
}
