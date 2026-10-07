import { getDB } from "../config/db.js";
import { ESTADOS_PEDIDO } from "../config/constants.js";
import { BadRequestError } from "../utils/appError.js";

// Lógica de negocio de pedidos: validación de stock, cálculo de totales,
// creación atómica del pedido y descuento de stock. Se mantiene separada de
// la capa HTTP (controladores) y de la capa de acceso a datos (modelos).
export const PedidoService = {
  async crearPedido({ usuario_id, items }) {
    const db = await getDB();

    return db.transaction(async (tx) => {
      let total = 0;
      const itemsProcesados = [];

      for (const item of items) {
        const producto = await tx.get(
          "SELECT id, nombre, precio, stock, unidad FROM productos WHERE id = ? AND activo = 1",
          [item.producto_id],
        );

        if (!producto) {
          throw new BadRequestError(
            `Producto con ID ${item.producto_id} no encontrado`,
          );
        }

        if (producto.stock < item.cantidad) {
          throw new BadRequestError(
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

      const resultadoPedido = await tx.run(
        `INSERT INTO pedidos (usuario_id, total, estado)
         VALUES (?, ?, ?)`,
        [usuario_id, total, ESTADOS_PEDIDO.PENDIENTE],
      );

      const pedidoId = resultadoPedido.lastID;

      for (const item of itemsProcesados) {
        await tx.run(
          `INSERT INTO pedidos_items (pedido_id, producto_id, cantidad, precio_unitario)
           VALUES (?, ?, ?, ?)`,
          [pedidoId, item.producto_id, item.cantidad, item.precio_unitario],
        );

        await tx.run(
          `UPDATE productos SET stock = stock - ? WHERE id = ?`,
          [item.cantidad, item.producto_id],
        );
      }

      return {
        id: pedidoId,
        usuario_id,
        total,
        estado: ESTADOS_PEDIDO.PENDIENTE,
        items: itemsProcesados,
      };
    });
  },
};
