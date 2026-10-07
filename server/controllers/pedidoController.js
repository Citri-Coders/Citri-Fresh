import { PedidoModel } from "../models/pedidoModel.js";
import { PedidoService } from "../services/pedidoService.js";
import { ROLES } from "../config/constants.js";
import { ForbiddenError, NotFoundError } from "../utils/appError.js";
import { sendSuccess } from "../utils/apiResponse.js";

const esPropietarioDelPedido = (pedido, usuario) =>
  pedido.usuario_id === usuario.id;

const esProductorConItems = (pedido, usuario) =>
  usuario.rol === ROLES.PRODUCTOR &&
  pedido.items.some((item) => item.productor_id === usuario.id);

// POST /api/pedidos
export const crearPedido = async (req, res, next) => {
  try {
    const { items } = req.body;
    const nuevoPedido = await PedidoService.crearPedido({
      usuario_id: req.user.id,
      items,
    });

    return sendSuccess(res, nuevoPedido, {
      status: 201,
      message: "Pedido creado exitosamente",
    });
  } catch (error) {
    return next(error);
  }
};

// GET /api/pedidos
export const obtenerPedidos = async (req, res, next) => {
  try {
    const pedidos = await PedidoModel.obtenerTodos({
      usuario_id: req.user.id,
      rol: req.user.rol,
    });
    return sendSuccess(res, pedidos);
  } catch (error) {
    return next(error);
  }
};

// GET /api/pedidos/:id
export const obtenerPedidoPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pedido = await PedidoModel.obtenerPorId(id);

    if (!pedido) {
      throw new NotFoundError("Pedido no encontrado");
    }

    // - Admin y Auditor: acceso total a auditoría
    // - Cliente: solo sus propios pedidos
    // - Productor: pedidos que contienen productos de su autoría o su propia compra
    const esAdminOAuditor =
      req.user.rol === ROLES.ADMIN || req.user.rol === ROLES.AUDITOR;

    if (
      !esAdminOAuditor &&
      !esPropietarioDelPedido(pedido, req.user) &&
      !esProductorConItems(pedido, req.user)
    ) {
      throw new ForbiddenError(
        "Acceso denegado: No tienes permiso para ver este pedido",
      );
    }

    return sendSuccess(res, pedido);
  } catch (error) {
    return next(error);
  }
};

// PATCH /api/pedidos/:id/estado
export const actualizarEstadoPedido = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const pedido = await PedidoModel.obtenerPorId(id);
    if (!pedido) {
      throw new NotFoundError("Pedido no encontrado");
    }

    // Solo admin o productores con productos en este pedido pueden cambiar el estado
    const esAdmin = req.user.rol === ROLES.ADMIN;
    if (!esAdmin && !esProductorConItems(pedido, req.user)) {
      throw new ForbiddenError(
        "Acceso denegado: No tienes permiso para modificar el estado de este pedido",
      );
    }

    await PedidoModel.actualizarEstado(id, estado);

    return sendSuccess(res, { pedido_id: Number(id), nuevo_estado: estado }, {
      message: "Estado del pedido actualizado exitosamente",
    });
  } catch (error) {
    return next(error);
  }
};
