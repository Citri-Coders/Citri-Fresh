import { CarritoModel } from "../models/carritoModel.js";
import { ProductoModel } from "../models/productoModel.js";
import { NotFoundError } from "../utils/appError.js";
import { sendSuccess } from "../utils/apiResponse.js";

// GET /api/carrito
export const obtenerCarrito = async (req, res, next) => {
  try {
    const items = await CarritoModel.obtenerPorUsuario(req.user.id);
    return sendSuccess(res, items);
  } catch (error) {
    return next(error);
  }
};

// POST /api/carrito
export const agregarItem = async (req, res, next) => {
  try {
    const { producto_id, cantidad } = req.body;

    const producto = await ProductoModel.obtenerPorId(producto_id);
    if (!producto) {
      throw new NotFoundError("Producto no encontrado");
    }

    const items = await CarritoModel.agregar(req.user.id, producto_id, cantidad);
    return sendSuccess(res, items, {
      status: 201,
      message: "Producto agregado al carrito",
    });
  } catch (error) {
    return next(error);
  }
};

// PUT /api/carrito/:productoId
export const actualizarItem = async (req, res, next) => {
  try {
    const { productoId } = req.params;
    const { cantidad } = req.body;

    const items = await CarritoModel.establecerCantidad(
      req.user.id,
      productoId,
      cantidad,
    );
    return sendSuccess(res, items, { message: "Cantidad actualizada" });
  } catch (error) {
    return next(error);
  }
};

// DELETE /api/carrito/:productoId
export const eliminarItem = async (req, res, next) => {
  try {
    const { productoId } = req.params;
    await CarritoModel.eliminar(req.user.id, productoId);
    return sendSuccess(res, null, {
      message: "Producto eliminado del carrito",
    });
  } catch (error) {
    return next(error);
  }
};

// DELETE /api/carrito
export const vaciarCarrito = async (req, res, next) => {
  try {
    await CarritoModel.vaciar(req.user.id);
    return sendSuccess(res, null, { message: "Carrito vaciado" });
  } catch (error) {
    return next(error);
  }
};

// POST /api/carrito/sincronizar
export const sincronizarCarrito = async (req, res, next) => {
  try {
    const items = await CarritoModel.sincronizar(req.user.id, req.body.items);
    return sendSuccess(res, items, { message: "Carrito sincronizado" });
  } catch (error) {
    return next(error);
  }
};
