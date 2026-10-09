import { BadRequestError } from "../utils/appError.js";

const MAX_ITEMS_SINCRONIZACION = 200;

// Valida el parámetro :productoId de la ruta
export const validateProductoIdParam = (req, res, next) => {
  const id = Number(req.params.productoId);
  if (!Number.isInteger(id) || id <= 0) {
    return next(new BadRequestError("El ID del producto no es válido"));
  }
  req.params.productoId = id;
  return next();
};

// Valida el cuerpo de POST /api/carrito
export const validateAgregarItem = (req, res, next) => {
  const productoId = Number(req.body.producto_id);
  if (!Number.isInteger(productoId) || productoId <= 0) {
    return next(new BadRequestError("El producto es obligatorio y debe ser válido"));
  }

  const cantidadBruta =
    req.body.cantidad === undefined || req.body.cantidad === null || req.body.cantidad === ""
      ? 1
      : Number(req.body.cantidad);
  if (!Number.isInteger(cantidadBruta) || cantidadBruta <= 0) {
    return next(new BadRequestError("La cantidad debe ser un entero mayor a 0"));
  }

  req.body.producto_id = productoId;
  req.body.cantidad = cantidadBruta;
  return next();
};

// Valida el cuerpo de PUT /api/carrito/:productoId
export const validateActualizarItem = (req, res, next) => {
  const cantidad = Number(req.body.cantidad);
  if (!Number.isInteger(cantidad) || cantidad < 0) {
    return next(new BadRequestError("La cantidad debe ser un entero no negativo"));
  }
  req.body.cantidad = cantidad;
  return next();
};

// Valida el cuerpo de POST /api/carrito/sincronizar
export const validateSincronizar = (req, res, next) => {
  const { items } = req.body;
  if (!Array.isArray(items)) {
    return next(new BadRequestError("Se espera un arreglo de items"));
  }
  if (items.length > MAX_ITEMS_SINCRONIZACION) {
    return next(
      new BadRequestError(
        `No se pueden sincronizar más de ${MAX_ITEMS_SINCRONIZACION} items`,
      ),
    );
  }

  const normalizados = [];
  for (const item of items) {
    const productoId = Number(item?.producto_id);
    const cantidad = Number(item?.cantidad);
    if (!Number.isInteger(productoId) || productoId <= 0) {
      return next(new BadRequestError("Item con producto_id inválido"));
    }
    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      return next(new BadRequestError("Item con cantidad inválida"));
    }
    normalizados.push({ producto_id: productoId, cantidad });
  }

  req.body.items = normalizados;
  return next();
};
