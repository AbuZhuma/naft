#!/usr/bin/env node
import { createApp } from "../cli/create-app.js";

const [,, command, projectName] = process.argv;

if (command === "create-app") {
  await createApp(projectName);
} else {
  console.log(`
Usage:
  npx naft create-app <project-name>
`);
}
