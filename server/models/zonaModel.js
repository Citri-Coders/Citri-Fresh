import { getDB } from "../config/db.js";

export const ZonaModel = {
  // Obtener todas las zonas de cultivo registradas
  async obtenerTodas() {
    const db = await getDB();
    return db.all("SELECT id, nombre FROM zonas ORDER BY nombre ASC");
  },

  // Obtener una zona por su ID
  async obtenerPorId(id) {
    const db = await getDB();
    return db.get("SELECT id, nombre FROM zonas WHERE id = ?", [id]);
  },

  // Crear una nueva zona (para administradores)
  async crear({ nombre }) {
    const db = await getDB();
    const result = await db.run(
      "INSERT INTO zonas (nombre) VALUES (?)",
      [nombre],
    );

    return {
      id: result.lastID,
      nombre,
    };
  },

  // Actualizar el nombre de una zona
  async actualizar(id, { nombre }) {
    const db = await getDB();
    const result = await db.run(
      "UPDATE zonas SET nombre = ? WHERE id = ?",
      [nombre, id],
    );

    return { cambios: result.changes };
  },

  // Eliminar una zona
  async eliminar(id) {
    const db = await getDB();
    const result = await db.run("DELETE FROM zonas WHERE id = ?", [id]);
    return { cambios: result.changes };
  },
};
