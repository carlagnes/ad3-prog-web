import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, "..");

export function readFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      fs.writeFileSync(filePath, "[]");
      return [];
    }

    throw error;
  }
}

export function writeFile(relativePath, data) {
  const filePath = path.join(ROOT, relativePath);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}
