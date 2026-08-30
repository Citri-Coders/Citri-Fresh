import { getDB } from "../config/db.js";

export const PedidoModel = {
  // Crear un pedido y sus ítems de forma atómica (con transacción)
  async crear({ usuario_id, items }) {
    const db = await getDB();

    // Iniciar transacción
    await db.run("BEGIN TRANSACTION");

    try {
      let total = 0;
      const itemsProcesados = [];

      // 1. Validar existencia y stock de cada producto
      for (const item of items) {
        const producto = await db.get(
          "SELECT id, nombre, precio, stock, unidad FROM productos WHERE id = ?",
          [item.producto_id],
        );

        if (!producto) {
          throw new Error(`Producto con ID ${item.producto_id} no encontrado`);
        }

        if (producto.stock < item.cantidad) {
          throw new Error(
            `Stock insuficiente para "${producto.nombre}". Disponible: ${producto.stock}, Solicitado: ${item.cantidad}`,
          );
        }

        const subtotal = producto.precio * item.cantidad;
        total += subtotal;

        itemsProcesados.push({
          producto_id: producto.id,
          nombre: producto.nombre,
          unidad: producto.unidad,
          cantidad: item.cantidad,
          precio_unitario: producto.precio,
          subtotal,
        });
      }

      // 2. Insertar encabezado del pedido
      const resultadoPedido = await db.run(
        `INSERT INTO pedidos (usuario_id, total, estado)
         VALUES (?, ?, 'pendiente')`,
        [usuario_id, total],
      );

      const pedidoId = resultadoPedido.lastID;

      // 3. Insertar cada ítem y descontar stock del producto
      for (const item of itemsProcesados) {
        await db.run(
          `INSERT INTO pedidos_items (pedido_id, producto_id, cantidad, precio_unitario)
           VALUES (?, ?, ?, ?)`,
          [pedidoId, item.producto_id, item.cantidad, item.precio_unitario],
        );

        await db.run(
          `UPDATE productos
           SET stock = stock - ?
           WHERE id = ?`,
          [item.cantidad, item.producto_id],
        );
      }

      // Confirmar transacción
      await db.run("COMMIT");

      return {
        id: pedidoId,
        usuario_id,
        total,
        estado: "pendiente",
        items: itemsProcesados,
      };
    } catch (error) {
      // Revertir cambios en caso de error
      await db.run("ROLLBACK");
      throw error;
    }
  },

  // Obtener pedidos según el rol del usuario
  async obtenerTodos({ usuario_id, rol }) {
    const db = await getDB();

    if (rol === "cliente") {
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

    if (rol === "productor") {
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
