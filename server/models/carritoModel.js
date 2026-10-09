import { getDB } from "../config/db.js";

// Las imágenes base64 (data URLs) pueden pesar varios MB; se omiten en el carrito
// para no inflar la respuesta ni el almacenamiento del cliente.
const IMAGEN_SEGURA = "CASE WHEN p.imagen LIKE 'data:%' THEN NULL ELSE p.imagen END AS imagen";

const SELECT_ITEMS = `
  SELECT
    ci.producto_id AS id,
    ci.producto_id,
    ci.cantidad,
    p.nombre,
    p.precio,
    p.unidad,
    ${IMAGEN_SEGURA},
    p.stock,
    p.activo,
    u.nombre AS productor
  FROM carrito_items ci
  JOIN productos p ON ci.producto_id = p.id
  JOIN usuarios u ON p.productor_id = u.id
  WHERE ci.usuario_id = ?
  ORDER BY ci.creado_en ASC
`;

export const CarritoModel = {
  // Listar los ítems del carrito de un usuario (con datos vigentes del producto)
  async obtenerPorUsuario(usuarioId) {
    const db = await getDB();
    return db.all(SELECT_ITEMS, [usuarioId]);
  },

  // Agregar una cantidad a un producto (incrementa si ya existía)
  async agregar(usuarioId, productoId, cantidad) {
    const db = await getDB();
    await db.run(
      `INSERT INTO carrito_items (usuario_id, producto_id, cantidad)
       VALUES (?, ?, ?)
       ON CONFLICT(usuario_id, producto_id)
       DO UPDATE SET cantidad = cantidad + excluded.cantidad,
                     actualizado_en = DATETIME('now')`,
      [usuarioId, productoId, cantidad],
    );
    return this.obtenerPorUsuario(usuarioId);
  },

  // Fijar la cantidad exacta de un producto (0 o menos lo elimina)
  async establecerCantidad(usuarioId, productoId, cantidad) {
    const db = await getDB();
    if (cantidad <= 0) {
      await db.run(
        "DELETE FROM carrito_items WHERE usuario_id = ? AND producto_id = ?",
        [usuarioId, productoId],
      );
    } else {
      await db.run(
        `INSERT INTO carrito_items (usuario_id, producto_id, cantidad)
         VALUES (?, ?, ?)
         ON CONFLICT(usuario_id, producto_id)
         DO UPDATE SET cantidad = excluded.cantidad,
                       actualizado_en = DATETIME('now')`,
        [usuarioId, productoId, cantidad],
      );
    }
    return this.obtenerPorUsuario(usuarioId);
  },

  // Eliminar un producto del carrito
  async eliminar(usuarioId, productoId) {
    const db = await getDB();
    const result = await db.run(
      "DELETE FROM carrito_items WHERE usuario_id = ? AND producto_id = ?",
      [usuarioId, productoId],
    );
    return { cambios: result.changes };
  },

  // Vaciar todo el carrito del usuario
  async vaciar(usuarioId) {
    const db = await getDB();
    const result = await db.run(
      "DELETE FROM carrito_items WHERE usuario_id = ?",
      [usuarioId],
    );
    return { cambios: result.changes };
  },

  // Fusionar un arreglo de ítems (carrito local) con el carrito del servidor.
  // Para cada ítem suma la cantidad enviada a la existente.
  async sincronizar(usuarioId, items) {
    const db = await getDB();
    for (const item of items) {
      await db.run(
        `INSERT INTO carrito_items (usuario_id, producto_id, cantidad)
         VALUES (?, ?, ?)
         ON CONFLICT(usuario_id, producto_id)
         DO UPDATE SET cantidad = cantidad + excluded.cantidad,
                       actualizado_en = DATETIME('now')`,
        [usuarioId, item.producto_id, item.cantidad],
      );
    }
    return this.obtenerPorUsuario(usuarioId);
  },
};
