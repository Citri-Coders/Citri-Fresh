import { getDB } from "../config/db.js";

export const ProductoModel = {
  // Obtener todos los productos con datos del productor y zona
  async obtenerTodos(filtros = {}) {
    const db = await getDB();
    let query = `
      SELECT 
        p.id,
        p.nombre,
        p.descripcion,
        p.precio,
        p.unidad,
        p.stock,
        p.zona AS zona_id,
        z.nombre AS zona_nombre,
        p.imagen,
        p.productor_id,
        u.nombre AS productor_nombre,
        p.creado_en
      FROM productos p
      JOIN usuarios u ON p.productor_id = u.id
      LEFT JOIN zonas z ON p.zona = z.id
    `;

    const conditions = [];
    const params = [];

    if (filtros.productor_id) {
      conditions.push("p.productor_id = ?");
      params.push(filtros.productor_id);
    }

    if (filtros.zona) {
      conditions.push("p.zona = ?");
      params.push(filtros.zona);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    query += " ORDER BY p.creado_en DESC";

    return db.all(query, params);
  },

  // Obtener un producto por su ID
  async obtenerPorId(id) {
    const db = await getDB();
    const query = `
      SELECT 
        p.id,
        p.nombre,
        p.descripcion,
        p.precio,
        p.unidad,
        p.stock,
        p.zona AS zona_id,
        z.nombre AS zona_nombre,
        p.imagen,
        p.productor_id,
        u.nombre AS productor_nombre,
        u.email AS productor_email,
        p.creado_en
      FROM productos p
      JOIN usuarios u ON p.productor_id = u.id
      LEFT JOIN zonas z ON p.zona = z.id
      WHERE p.id = ?
    `;

    return db.get(query, [id]);
  },

  // Crear un nuevo producto
  async crear({
    nombre,
    descripcion = "",
    precio,
    unidad = "unidad",
    stock = 0,
    zona = null,
    imagen = "",
    productor_id,
  }) {
    const db = await getDB();
    const query = `
      INSERT INTO productos (nombre, descripcion, precio, unidad, stock, zona, productor_id, imagen)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await db.run(query, [
      nombre,
      descripcion,
      precio,
      unidad,
      stock,
      zona,
      productor_id,
      imagen,
    ]);

    return {
      id: result.lastID,
      nombre,
      descripcion,
      precio,
      unidad,
      stock,
      zona,
      productor_id,
      imagen,
    };
  },

  // Actualizar un producto existente
  async actualizar(id, datosActualizados) {
    const db = await getDB();
    const query = `
      UPDATE productos
      SET nombre = ?, descripcion = ?, precio = ?, unidad = ?, stock = ?, zona = ?, imagen = ?
      WHERE id = ?
    `;

    const result = await db.run(query, [
      datosActualizados.nombre,
      datosActualizados.descripcion,
      datosActualizados.precio,
      datosActualizados.unidad,
      datosActualizados.stock,
      datosActualizados.zona,
      datosActualizados.imagen,
      id,
    ]);

    return { cambios: result.changes };
  },

  // Eliminar un producto
  async eliminar(id) {
    const db = await getDB();
    const query = "DELETE FROM productos WHERE id = ?";
    const result = await db.run(query, [id]);
    return { cambios: result.changes };
  },
};
