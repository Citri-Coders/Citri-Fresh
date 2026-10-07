import { getDB } from "../config/db.js";
import { ROLES } from "../config/constants.js";

export const PedidoModel = {
  // Obtener pedidos según el rol del usuario
  async obtenerTodos({ usuario_id, rol }) {
    const db = await getDB();

    if (rol === ROLES.CLIENTE) {
      // Clientes solo ven sus propias compras
      const query = `
        SELECT 
          p.id,
          p.usuario_id,
          p.total,
          p.estado,
          p.fecha,
          COUNT(pi.id) AS total_items
        FROM pedidos p
        LEFT JOIN pedidos_items pi ON p.id = pi.pedido_id
        WHERE p.usuario_id = ?
        GROUP BY p.id
        ORDER BY p.fecha DESC
      `;
      return db.all(query, [usuario_id]);
    }

    if (rol === ROLES.PRODUCTOR) {
      // Productores ven pedidos que contienen al menos uno de sus productos
      const query = `
        SELECT DISTINCT
          p.id,
          p.usuario_id,
          u.nombre AS cliente_nombre,
          u.email AS cliente_email,
          p.total,
          p.estado,
          p.fecha
        FROM pedidos p
        JOIN usuarios u ON p.usuario_id = u.id
        JOIN pedidos_items pi ON p.id = pi.pedido_id
        JOIN productos prod ON pi.producto_id = prod.id
        WHERE prod.productor_id = ?
        ORDER BY p.fecha DESC
      `;
      return db.all(query, [usuario_id]);
    }

    // Administradores ven todos los pedidos globales
    const query = `
      SELECT 
        p.id,
        p.usuario_id,
        u.nombre AS cliente_nombre,
        u.email AS cliente_email,
        p.total,
        p.estado,
        p.fecha,
        COUNT(pi.id) AS total_items
      FROM pedidos p
      JOIN usuarios u ON p.usuario_id = u.id
      LEFT JOIN pedidos_items pi ON p.id = pi.pedido_id
      GROUP BY p.id
      ORDER BY p.fecha DESC
    `;
    return db.all(query);
  },

  // Obtener detalle completo de un pedido con sus ítems
  async obtenerPorId(id) {
    const db = await getDB();

    const pedido = await db.get(
      `SELECT 
        p.id,
        p.usuario_id,
        u.nombre AS cliente_nombre,
        u.email AS cliente_email,
        p.total,
        p.estado,
        p.fecha
      FROM pedidos p
      JOIN usuarios u ON p.usuario_id = u.id
      WHERE p.id = ?`,
      [id],
    );

    if (!pedido) return null;

    // Obtener los ítems del pedido con datos del producto y su productor
    const items = await db.all(
      `SELECT 
        pi.id AS item_id,
        pi.producto_id,
        prod.nombre AS producto_nombre,
        prod.unidad AS producto_unidad,
        prod.imagen AS producto_imagen,
        prod.productor_id,
        u_prod.nombre AS productor_nombre,
        pi.cantidad,
        pi.precio_unitario,
        (pi.cantidad * pi.precio_unitario) AS subtotal
      FROM pedidos_items pi
      JOIN productos prod ON pi.producto_id = prod.id
      JOIN usuarios u_prod ON prod.productor_id = u_prod.id
      WHERE pi.pedido_id = ?`,
      [id],
    );

    return {
      ...pedido,
      items,
    };
  },

  // Actualizar el estado de un pedido
  async actualizarEstado(id, nuevoEstado) {
    const db = await getDB();
    const result = await db.run(
      `UPDATE pedidos
       SET estado = ?
       WHERE id = ?`,
      [nuevoEstado, id],
    );

    return { cambios: result.changes };
  },
};
