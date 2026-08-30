import { PedidoModel } from "../models/pedidoModel.js";

// POST /api/pedidos
export const crearPedido = async (req, res) => {
  try {
    const { items } = req.body;

    const nuevoPedido = await PedidoModel.crear({
      usuario_id: req.user.id,
      items,
    });

    return res.status(201).json({
      message: "Pedido creado exitosamente",
      pedido: nuevoPedido,
    });
  } catch (error) {
    console.error("Error al crear pedido:", error.message || error);

    // Errores de negocio (stock insuficiente o producto no encontrado)
    if (
      error.message.includes("Stock insuficiente") ||
      error.message.includes("no encontrado")
    ) {
      return res.status(400).json({ error: error.message });
    }

    return res
      .status(500)
      .json({ error: "Error interno al procesar el pedido" });
  }
};

// GET /api/pedidos
export const obtenerPedidos = async (req, res) => {
  try {
    const pedidos = await PedidoModel.obtenerTodos({
      usuario_id: req.user.id,
      rol: req.user.rol,
    });

    return res.status(200).json(pedidos);
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    return res
      .status(500)
      .json({ error: "Error interno al obtener los pedidos" });
  }
};

// GET /api/pedidos/:id
export const obtenerPedidoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const pedido = await PedidoModel.obtenerPorId(id);

    if (!pedido) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }

    // Regla de autorización:
    // - Admin: acceso total
    // - Cliente: solo puede ver sus propios pedidos
    // - Productor: puede ver el pedido si contiene productos de su autoría o si es su propia compra
    const esAdmin = req.user.rol === "admin";
    const esComprador = pedido.usuario_id === req.user.id;
    const esProductorDeItem =
      req.user.rol === "productor" &&
      pedido.items.some((item) => item.productor_id === req.user.id);

    if (!esAdmin && !esComprador && !esProductorDeItem) {
      return res.status(403).json({
        error: "Acceso denegado: No tienes permiso para ver este pedido",
      });
    }

    return res.status(200).json(pedido);
  } catch (error) {
    console.error("Error al obtener detalle del pedido:", error);
    return res
      .status(500)
      .json({ error: "Error interno al buscar el pedido" });
  }
};

// PATCH /api/pedidos/:id/estado
export const actualizarEstadoPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const pedido = await PedidoModel.obtenerPorId(id);

    if (!pedido) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }

    // Regla de autorización: Solo admin o productores con productos en este pedido pueden cambiar el estado
    const esAdmin = req.user.rol === "admin";
    const esProductorDeItem =
      req.user.rol === "productor" &&
      pedido.items.some((item) => item.productor_id === req.user.id);

    if (!esAdmin && !esProductorDeItem) {
      return res.status(403).json({
        error:
          "Acceso denegado: No tienes permiso para modificar el estado de este pedido",
      });
    }

    await PedidoModel.actualizarEstado(id, estado);

    return res.status(200).json({
      message: "Estado del pedido actualizado exitosamente",
      pedido_id: Number(id),
      nuevo_estado: estado,
    });
  } catch (error) {
    console.error("Error al actualizar estado del pedido:", error);
    return res
      .status(500)
      .json({ error: "Error interno al actualizar el estado del pedido" });
  }
};
