import "dotenv/config";
import bcrypt from "bcrypt";
import { getDB } from "../server/config/db.js";
import { USUARIOS_BASE, ZONAS_BASE, PRODUCTOS_BASE } from "../db/seedData.js";

async function seedDB() {
  try {
    const db = await getDB();
    console.log("🌱 Iniciando carga de datos de prueba...");

    // 1. Insertar Zonas
    for (const nombre of ZONAS_BASE) {
      await db.run("INSERT OR IGNORE INTO zonas (nombre) VALUES (?)", [nombre]);
    }

    // 2. Insertar Usuarios (upsert para refrescar credenciales del seed)
    const saltRounds = 10;
    for (const u of USUARIOS_BASE) {
      const password_hash = await bcrypt.hash(u.pass, saltRounds);
      await db.run(
        `INSERT INTO usuarios (nombre, email, password_hash, rol)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(email) DO UPDATE SET
           nombre = excluded.nombre,
           password_hash = excluded.password_hash,
           rol = excluded.rol`,
        [u.nombre, u.email, password_hash, u.rol],
      );
    }

    const productor = await db.get("SELECT id FROM usuarios WHERE email = ?", [
      "productor@citrifresh.com",
    ]);

    // 3. Insertar productos base
    if (productor) {
      for (const p of PRODUCTOS_BASE) {
        await db.run(
          `INSERT OR IGNORE INTO productos
           (nombre, descripcion, precio, unidad, stock, zona, productor_id, imagen)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            p.nombre,
            p.descripcion,
            p.precio,
            p.unidad,
            p.stock,
            p.zona,
            productor.id,
            p.imagen,
          ],
        );
      }
    }

    console.log("Datos de prueba insertados con éxito.");
    process.exit(0);
  } catch (error) {
    console.error("Error al sembrar los datos:", error.message);
    process.exit(1);
  }
}

seedDB();
