import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getDB } from "../server/config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDB() {
  try {
    const db = await getDB();
    const schemaPath = path.resolve(__dirname, "../db/schema.sql");
    const schemaSQL = fs.readFileSync(schemaPath, "utf-8");

    await db.exec(schemaSQL);

    console.log("Base de datos inicializada correctamente desde db/schema.sql");
    process.exit(0);
  } catch (error) {
    console.error("Error al inicializar las tablas:", error.message);
    process.exit(1);
  }
}

initDB();

