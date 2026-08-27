import path from "path";
import { fileURLToPath } from "url";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let dbInstance = null;

export async function getDB() {
  if (!dbInstance) {
    const dbPath = process.env.DB_PATH
      ? path.resolve(process.cwd(), process.env.DB_PATH)
      : path.resolve(__dirname, "../../db/citrifresh.db");

    dbInstance = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    await dbInstance.run("PRAGMA foreign_keys = ON");
  }
  return dbInstance;
}
