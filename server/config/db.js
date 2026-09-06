import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import bcrypt from "bcrypt";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let dbInstance = null;
let dbPromise = null;

// En Vercel (producción serverless) el FS es solo-lectura excepto /tmp
function resolveDbPath() {
  if (process.env.DB_PATH) {
    return path.resolve(process.cwd(), process.env.DB_PATH);
  }
  // En producción Vercel usamos /tmp (único directorio escribible)
  if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
    return "/tmp/citrifresh.db";
  }
  return path.resolve(__dirname, "../../db/citrifresh.db");
}

async function initSchema(db) {
  // Aplicar schema completo (todas las sentencias usan CREATE TABLE IF NOT EXISTS)
  const schemaPath = path.resolve(__dirname, "../../db/schema.sql");
  if (fs.existsSync(schemaPath)) {
    const schemaSQL = fs.readFileSync(schemaPath, "utf-8");
    await db.exec(schemaSQL);
  } else {
    // Schema embebido como fallback
    await db.exec(`
      PRAGMA foreign_keys = ON;
      CREATE TABLE IF NOT EXISTS zonas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL UNIQUE
      );
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        rol TEXT NOT NULL DEFAULT 'cliente' CHECK (rol IN ('admin','productor','cliente','auditor')),
        creado_en TEXT NOT NULL DEFAULT (DATETIME('now')),
        foto TEXT,
        telefono TEXT,
        direccion TEXT,
        nombre_finca TEXT,
        zona_cultivo TEXT,
        capacidad_produccion TEXT,
        tipos_citricos TEXT
      );
      CREATE TABLE IF NOT EXISTS productos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        descripcion TEXT,
        precio REAL NOT NULL CHECK (precio >= 0),
        unidad TEXT NOT NULL DEFAULT 'unidad',
        stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
        zona INTEGER,
        productor_id INTEGER NOT NULL,
        imagen TEXT,
        creado_en TEXT NOT NULL DEFAULT (DATETIME('now')),
        FOREIGN KEY (zona) REFERENCES zonas(id) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (productor_id) REFERENCES usuarios(id) ON DELETE CASCADE ON UPDATE CASCADE
      );
      CREATE TABLE IF NOT EXISTS pedidos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER NOT NULL,
        total REAL NOT NULL DEFAULT 0.0 CHECK (total >= 0),
        estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente','pagado','enviado','completado','cancelado')),
        fecha TEXT NOT NULL DEFAULT (DATETIME('now')),
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT ON UPDATE CASCADE
      );
      CREATE TABLE IF NOT EXISTS pedidos_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pedido_id INTEGER NOT NULL,
        producto_id INTEGER NOT NULL,
        cantidad INTEGER NOT NULL CHECK (cantidad > 0),
        precio_unitario REAL NOT NULL CHECK (precio_unitario >= 0),
        FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE RESTRICT ON UPDATE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_productos_productor ON productos(productor_id);
      CREATE INDEX IF NOT EXISTS idx_productos_zona ON productos(zona);
      CREATE INDEX IF NOT EXISTS idx_pedidos_usuario ON pedidos(usuario_id);
      CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos(estado);
      CREATE INDEX IF NOT EXISTS idx_pedidos_items_pedido ON pedidos_items(pedido_id);
      CREATE INDEX IF NOT EXISTS idx_pedidos_items_producto ON pedidos_items(producto_id);
    `);
  }

  // Asegurar que si la tabla usuarios ya existía con esquema viejo, tenga las columnas requeridas
  const columns = await db.all("PRAGMA table_info(usuarios)");
  const colNames = columns.map(c => c.name);
  const requiredCols = [
    { name: "foto", type: "TEXT" },
    { name: "telefono", type: "TEXT" },
    { name: "direccion", type: "TEXT" },
    { name: "nombre_finca", type: "TEXT" },
    { name: "zona_cultivo", type: "TEXT" },
    { name: "capacidad_produccion", type: "TEXT" },
    { name: "tipos_citricos", type: "TEXT" }
  ];

  for (const col of requiredCols) {
    if (!colNames.includes(col.name)) {
      try {
        await db.run(`ALTER TABLE usuarios ADD COLUMN ${col.name} ${col.type}`);
      } catch (err) {
        // Ignorar si ya existe
      }
    }
  }
}

async function seedDefaultUsers(db) {
  // Solo insertar si la tabla está vacía (primer arranque en entorno limpio)
  const count = await db.get("SELECT COUNT(*) AS total FROM usuarios");
  if (count && count.total > 0) return;

  console.log("[CitriFresh DB] Sembrando usuarios por defecto...");
  const SALT = 10;
  const usuarios = [
    { nombre: "Administrador Citri-Fresh",    email: "admin@citrifresh.com",     pass: "admin123",     rol: "admin" },
    { nombre: "Auditor General de Calidad",   email: "auditor@citrifresh.com",   pass: "auditor123",   rol: "auditor" },
    { nombre: "Finca Cítricos San Carlos",    email: "productor@citrifresh.com", pass: "productor123", rol: "productor" },
    { nombre: "Comprador Demo",               email: "cliente@citrifresh.com",   pass: "cliente123",   rol: "cliente" },
  ];

  for (const u of usuarios) {
    const hash = await bcrypt.hash(u.pass, SALT);
    await db.run(
      `INSERT OR IGNORE INTO usuarios (nombre, email, password_hash, rol) VALUES (?, ?, ?, ?)`,
      [u.nombre, u.email, hash, u.rol]
    );
  }

  // Zonas base
  for (const zona of ["León", "Chinandega", "Carazo", "Rivas"]) {
    await db.run("INSERT OR IGNORE INTO zonas (nombre) VALUES (?)", [zona]);
  }
  console.log("[CitriFresh DB] Usuarios por defecto creados correctamente.");
}

async function openAndInit() {
  const dbPath = resolveDbPath();
  const dbDir = path.dirname(dbPath);

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  await db.run("PRAGMA foreign_keys = ON");
  await initSchema(db);
  await seedDefaultUsers(db);
  return db;
}

export async function getDB() {
  if (dbInstance) return dbInstance;
  if (!dbPromise) {
    dbPromise = openAndInit().then((db) => {
      dbInstance = db;
      return dbInstance;
    }).catch(err => {
      dbPromise = null;
      throw err;
    });
  }
  return dbPromise;
}
