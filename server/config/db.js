import logger from "./logger.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import { createClient } from "@libsql/client";
import { USUARIOS_BASE, ZONAS_BASE, PRODUCTOS_BASE } from "../../db/seedData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let dbInstance = null;
let dbPromise = null;

function mapRows(res) {
  return res.rows.map((row) => {
    const obj = {};
    for (const col of res.columns) {
      obj[col] = row[col];
    }
    return obj;
  });
}

function mapSingleRow(res) {
  if (!res.rows || res.rows.length === 0) return undefined;
  const row = res.rows[0];
  const obj = {};
  for (const col of res.columns) {
    obj[col] = row[col];
  }
  return obj;
}

// Crea un ejecutor ({ all, get, run }) a partir de una función execute de libsql.
// Se reutiliza tanto para el cliente principal como para transacciones interactivas.
function createLibsqlExecutor(execute) {
  const normalize = (params) => (Array.isArray(params) ? params : [params]);
  return {
    async all(sql, params = []) {
      return mapRows(await execute({ sql, args: normalize(params) }));
    },
    async get(sql, params = []) {
      return mapSingleRow(await execute({ sql, args: normalize(params) }));
    },
    async run(sql, params = []) {
      const res = await execute({ sql, args: normalize(params) });
      return {
        lastID:
          res.lastInsertRowid !== undefined && res.lastInsertRowid !== null
            ? Number(res.lastInsertRowid)
            : undefined,
        changes: res.rowsAffected !== undefined ? Number(res.rowsAffected) : 0,
      };
    },
  };
}

function wrapLibsqlClient(client) {
  const executor = createLibsqlExecutor((stmt) => client.execute(stmt));

  return {
    ...executor,
    async exec(sql) {
      await client.executeMultiple(sql);
    },
    // Transacción interactiva real de Turso: agrupa las operaciones y confirma
    // o revierte de forma atómica (BEGIN/COMMIT/ROLLBACK no funcionan por HTTP).
    async transaction(fn) {
      const tx = await client.transaction("write");
      const txExecutor = createLibsqlExecutor((stmt) => tx.execute(stmt));
      try {
        const result = await fn(txExecutor);
        await tx.commit();
        return result;
      } catch (error) {
        try {
          await tx.rollback();
        } catch (rollbackErr) {
          // La transacción puede haberse cerrado ya; se ignora el error de rollback
        }
        throw error;
      } finally {
        try {
          await tx.close();
        } catch (closeErr) {
          // Ignorar errores al cerrar una transacción ya finalizada
        }
      }
    },
  };
}


// En Vercel (producción serverless) el FS es solo-lectura excepto /tmp
function resolveDbPath() {
  if (process.env.DB_PATH) {
    return path.resolve(process.cwd(), process.env.DB_PATH);
  }
  // En producción Vercel usamos /tmp (único directorio escribible) como fallback
  if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
    return "/tmp/citrifresh.db";
  }
  return path.resolve(__dirname, "../../db/citrifresh.db");
}

async function initSchema(db) {
  // Schema embebido como única fuente de verdad en runtime.
  // No se lee db/schema.sql del disco porque el sistema de archivos no está
  // garantizado dentro del bundle serverless (Vercel), lo que causaba que el
  // fallback embebido se aplicara de forma inconsistente.
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
        activo INTEGER NOT NULL DEFAULT 1,
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
      CREATE TABLE IF NOT EXISTS codigos_recuperacion (
        email TEXT PRIMARY KEY,
        codigo TEXT NOT NULL,
        expira_en INTEGER NOT NULL,
        intentos INTEGER NOT NULL DEFAULT 0,
        verificado INTEGER NOT NULL DEFAULT 0
      );
      CREATE INDEX IF NOT EXISTS idx_productos_productor ON productos(productor_id);
      CREATE INDEX IF NOT EXISTS idx_productos_zona ON productos(zona);
      CREATE INDEX IF NOT EXISTS idx_pedidos_usuario ON pedidos(usuario_id);
      CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos(estado);
      CREATE INDEX IF NOT EXISTS idx_pedidos_fecha ON pedidos(fecha);
      CREATE INDEX IF NOT EXISTS idx_pedidos_items_pedido ON pedidos_items(pedido_id);
      CREATE INDEX IF NOT EXISTS idx_pedidos_items_producto ON pedidos_items(producto_id);
    `);

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

  // Asegurar la columna de borrado lógico en productos para instalaciones existentes
  const prodColumns = await db.all("PRAGMA table_info(productos)");
  const prodColNames = prodColumns.map(c => c.name);
  if (!prodColNames.includes("activo")) {
    try {
      await db.run("ALTER TABLE productos ADD COLUMN activo INTEGER NOT NULL DEFAULT 1");
    } catch (err) {
      // Ignorar si ya existe
    }
  }
}

async function seedDefaultUsers(db) {
  // Solo insertar si la tabla está vacía (primer arranque en entorno limpio)
  const count = await db.get("SELECT COUNT(*) AS total FROM usuarios");
  if (count && count.total > 0) return;

  logger.info("[CitriFresh DB] Sembrando usuarios por defecto...");
  const SALT = 10;

  for (const u of USUARIOS_BASE) {
    const hash = await bcrypt.hash(u.pass, SALT);
    await db.run(
      `INSERT OR IGNORE INTO usuarios (nombre, email, password_hash, rol) VALUES (?, ?, ?, ?)`,
      [u.nombre, u.email, hash, u.rol]
    );
  }

  // Zonas base de Nicaragua
  for (const zona of ZONAS_BASE) {
    await db.run("INSERT OR IGNORE INTO zonas (nombre) VALUES (?)", [zona]);
  }

  // Si no hay productos, sembrar los productos de demostración para el productor base
  const prodCount = await db.get("SELECT COUNT(*) AS total FROM productos");
  if (!prodCount || prodCount.total === 0) {
    const productor = await db.get("SELECT id FROM usuarios WHERE email = ?", ["productor@citrifresh.com"]);
    if (productor) {
      for (const p of PRODUCTOS_BASE) {
        await db.run(
          `INSERT OR IGNORE INTO productos (nombre, descripcion, precio, unidad, stock, zona, productor_id, imagen)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [p.nombre, p.descripcion, p.precio, p.unidad, p.stock, p.zona, productor.id, p.imagen]
        );
      }
    }
  }

  logger.info("[CitriFresh DB] Usuarios, zonas y catálogo base inicializados correctamente.");
}

async function openAndInit() {
  const tursoUrl = process.env.TURSO_DATABASE_URL || "libsql://citrifresh-db-kambidev.aws-us-east-1.turso.io";
  const tursoToken = process.env.TURSO_AUTH_TOKEN || "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTEyMTYyNzEsImlkIjoiMDFhMTBjY2MtMmEwMS03NzY1LWIyZWQtY2VhNmIyZDU4NjllIiwia2lkIjoiM3pTd2tWRTRwc3pvOGNHNVY1YnpkVEdGNlFXLUd6ZnBpcUZIbVJ2dkxMTSIsInJpZCI6IjM0ODkzZGFlLTU0ZmUtNDZkYi04NGM1LWY1ZjY4MzczNmU1MSJ9.-_oRe91ufsPhy-xHyefwr4QsAAVcf6XBvn2EBMIOgbDwgN1EHrJvFXWZJVfXzFiKlwQ4-4Va_alXmN7gv3UkCQ";

  if (tursoUrl) {
    logger.info("[CitriFresh DB] Conectando a Turso (SQLite Cloud)...");
    const client = createClient({
      url: tursoUrl,
      authToken: tursoToken,
    });
    const db = wrapLibsqlClient(client);
    await initSchema(db);
    await seedDefaultUsers(db);
    return db;
  }

  const dbPath = resolveDbPath();
  const dbDir = path.dirname(dbPath);

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const { open } = await import("sqlite");
  const sqlite3Module = await import("sqlite3");
  const sqlite3 = sqlite3Module.default || sqlite3Module;

  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  // Transacción portable sobre sqlite3 local (misma API que el wrapper de Turso)
  db.transaction = async (fn) => {
    await db.run("BEGIN TRANSACTION");
    try {
      const result = await fn(db);
      await db.run("COMMIT");
      return result;
    } catch (error) {
      await db.run("ROLLBACK");
      throw error;
    }
  };

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
