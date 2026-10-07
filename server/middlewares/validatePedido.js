import { ESTADOS_PEDIDO_VALIDOS } from "../config/constants.js";
import { BadRequestError } from "../utils/appError.js";

export const validateCrearPedido = (req, res, next) => {
  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return next(
      new BadRequestError("El pedido debe contener un arreglo de ítems no vacío"),
    );
  }

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    if (!item.producto_id || isNaN(Number(item.producto_id))) {
      return next(
        new BadRequestError(
          `El ítem en la posición ${i} debe tener un 'producto_id' válido`,
        ),
      );
    }

    const cantidad = Number(item.cantidad);
    if (isNaN(cantidad) || !Number.isInteger(cantidad) || cantidad <= 0) {
      return next(
        new BadRequestError(
          `La cantidad del producto con ID ${item.producto_id} debe ser un número entero mayor a 0`,
        ),
      );
    }

    // Normalizar tipos
    item.producto_id = Number(item.producto_id);
    item.cantidad = cantidad;
  }

  return next();
};

export const validateActualizarEstado = (req, res, next) => {
  const { estado } = req.body;

  if (!estado || typeof estado !== "string") {
    return next(new BadRequestError("El campo 'estado' es obligatorio"));
  }

  const estadoNormalizado = estado.trim().toLowerCase();

  if (!ESTADOS_PEDIDO_VALIDOS.includes(estadoNormalizado)) {
    return next(
      new BadRequestError(
        `Estado inválido. Los estados permitidos son: [${ESTADOS_PEDIDO_VALIDOS.join(", ")}]`,
      ),
    );
  }

  req.body.estado = estadoNormalizado;
  return next();
};
