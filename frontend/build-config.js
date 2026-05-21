import fs from "fs";
import path from "path";

const envPath = path.join(process.cwd(), ".env");
let apiBaseUrl = process.env.API_BASE_URL;

if (!apiBaseUrl && fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }
    const eqIndex = line.indexOf("=");
    if (eqIndex === -1) {
      continue;
    }
    const key = line.slice(0, eqIndex).trim();
    const value = line
      .slice(eqIndex + 1)
      .trim()
      .replace(/^"(.*)"$/, "$1")
      .replace(/^'(.*)'$/, "$1");
    if (key === "API_BASE_URL") {
      apiBaseUrl = value;
      break;
    }
  }
}

if (!apiBaseUrl) {
  console.error("API_BASE_URL es requerido para generar config.js");
  process.exit(1);
}

const output = `window.APP_CONFIG = { API_BASE_URL: ${JSON.stringify(apiBaseUrl)} };`;
fs.writeFileSync(path.join(process.cwd(), "config.js"), output, "utf8");
console.log("config.js generado.");
