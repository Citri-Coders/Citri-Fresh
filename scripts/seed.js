import "dotenv/config";
import bcrypt from "bcrypt";
import { getDB } from "../server/config/db.js";

async function seedDB() {
  try {
    const db = await getDB();
    console.log("🌱 Iniciando carga de datos de prueba...");

    // 1. Hashear contraseñas base
    const saltRounds = 10;
    const adminPass = await bcrypt.hash("admin123", saltRounds);
    const producerPass = await bcrypt.hash("productor123", saltRounds);
    const clientPass = await bcrypt.hash("cliente123", saltRounds);

    // 2. Insertar Zonas
    const zonas = ["León", "Chinandega", "Carazo", "Rivas"];
    for (const nombre of zonas) {
      await db.run("INSERT OR IGNORE INTO zonas (nombre) VALUES (?)", [nombre]);
    }

    // 3. Insertar Usuarios
    const usuarios = [
      {
        nombre: "Administrador Citri-Fresh",
        email: "admin@citrifresh.com",
        password_hash: adminPass,
        rol: "admin",
      },
      {
        nombre: "Finca Cítricos San Carlos",
        email: "productor@citrifresh.com",
        password_hash: producerPass,
        rol: "productor",
      },
      {
        nombre: "Comprador Demo",
        email: "cliente@citrifresh.com",
        password_hash: clientPass,
        rol: "cliente",
      },
    ];

    for (const u of usuarios) {
      await db.run(
        `INSERT OR IGNORE INTO usuarios (nombre, email, password_hash, rol)
         VALUES (?, ?, ?, ?)`,
        [u.nombre, u.email, u.password_hash, u.rol],
      );
    }

    const productor = await db.get("SELECT id FROM usuarios WHERE email = ?", [
      "productor@citrifresh.com",
    ]);

    if (productor) {
      const productos = [
        {
          nombre: "Naranja Valencia (Cien)",
          descripcion:
            "Naranja jugosa y dulce, ideal para consumo fresco o jugos.",
          precio: 350.0,
          unidad: "cien",
          stock: 45,
          zona: 1, // León
          productor_id: productor.id,
          imagen: "/public/images/naranja.jpg",
        },
        {
          nombre: "Limón Criollo (Docena)",
          descripcion:
            "Limón agrio criollo de excelente calidad y alto contenido de jugo.",
          precio: 40.0,
          unidad: "docena",
          stock: 120,
          zona: 1, // León
          productor_id: productor.id,
          imagen: "/public/images/limon.jpg",
        },
        {
          nombre: "Mandarina Reina (Docena)",
          descripcion:
            "Mandarina dulce de fácil pelado, cosecha fresca de temporada.",
          precio: 60.0,
          unidad: "docena",
          stock: 30,
          zona: 3, // Carazo
          productor_id: productor.id,
          imagen: "/public/images/mandarina.jpg",
        },
      ];

      for (const p of productos) {
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
            p.productor_id,
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
