import { getDB } from "../config/db.js";

export const UsuarioModel = {
  async findByEmail(email) {
    const db = await getDB();
    return db.get(
      "SELECT id, nombre, email, password_hash, rol, creado_en FROM usuarios WHERE email = ?",
      [email],
    );
  },

  async findById(id) {
    const db = await getDB();
    return db.get(
      "SELECT id, nombre, email, rol, creado_en FROM usuarios WHERE id = ?",
      [id],
    );
  },

  async findByIdWithPassword(id) {
    const db = await getDB();
    return db.get(
      "SELECT id, nombre, email, password_hash, rol, creado_en FROM usuarios WHERE id = ?",
      [id],
    );
  },

  async create({ nombre, email, password_hash, rol = "cliente" }) {
    const db = await getDB();
    const result = await db.run(
      `INSERT INTO usuarios (nombre, email, password_hash, rol)
       VALUES (?, ?, ?, ?)`,
      [nombre, email, password_hash, rol],
    );
    return {
      id: result.lastID,
      nombre,
      email,
      rol,
    };
  },

  async update(id, { nombre, email, password_hash }) {
    const db = await getDB();

    if (password_hash) {
      await db.run(
        `UPDATE usuarios
         SET nombre = ?, email = ?, password_hash = ?
         WHERE id = ?`,
        [nombre, email, password_hash, id],
      );
    } else {
      await db.run(
        `UPDATE usuarios
         SET nombre = ?, email = ?
         WHERE id = ?`,
        [nombre, email, id],
      );
    }

    return this.findById(id);
  },
};
