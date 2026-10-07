import { BadRequestError } from "../utils/appError.js";
import { LIMITES_CAMPOS } from "../config/constants.js";

const validarCamposProducto = (body) => {
  const { nombre, descripcion } = body;
  if (typeof nombre === "string" && nombre.length > LIMITES_CAMPOS.nombre) {
    return "El nombre del producto no puede superar los 100 caracteres";
  }
  if (
    typeof descripcion === "string" &&
    descripcion.length > LIMITES_CAMPOS.descripcion
  ) {
    return "La descripción no puede superar los 1000 caracteres";
  }
  return null;
};

export const validateCrearProducto = (req, res, next) => {
  const { nombre, precio, stock, zona } = req.body;

  if (!nombre || nombre.trim() === "") {
    return next(new BadRequestError("El nombre del producto es obligatorio"));
  }

  const errorLongitud = validarCamposProducto(req.body);
  if (errorLongitud) {
    return next(new BadRequestError(errorLongitud));
  }

  if (precio === undefined || precio === null || precio === "") {
    return next(new BadRequestError("El precio es obligatorio"));
  }

  if (stock === undefined || stock === null || stock === "") {
    return next(new BadRequestError("El stock es obligatorio"));
  }

  const numPrecio = Number(precio);
  if (isNaN(numPrecio) || numPrecio < 0) {
    return next(
      new BadRequestError("El precio debe ser un número no negativo"),
    );
  }

  const numStock = Number(stock);
  if (isNaN(numStock) || !Number.isInteger(numStock) || numStock < 0) {
    return next(
      new BadRequestError("El stock debe ser un número entero no negativo"),
    );
  }

  if (zona !== undefined && zona !== null && zona !== "") {
    const numZona = Number(zona);
    if (isNaN(numZona) || !Number.isInteger(numZona) || numZona <= 0) {
      return next(new BadRequestError("La zona especificada no es válida"));
    }
  }

  return next();
};

export const validateActualizarProducto = (req, res, next) => {
  const { nombre, precio, stock, zona } = req.body;

  if (nombre !== undefined && nombre.trim() === "") {
    return next(
      new BadRequestError("El nombre del producto no puede estar vacío"),
    );
  }

  const errorLongitud = validarCamposProducto(req.body);
  if (errorLongitud) {
    return next(new BadRequestError(errorLongitud));
  }

  if (precio !== undefined) {
    const numPrecio = Number(precio);
    if (isNaN(numPrecio) || numPrecio < 0) {
      return next(
        new BadRequestError("El precio debe ser un número no negativo"),
      );
    }
  }

  if (stock !== undefined) {
    const numStock = Number(stock);
    if (isNaN(numStock) || !Number.isInteger(numStock) || numStock < 0) {
      return next(
        new BadRequestError("El stock debe ser un número entero no negativo"),
      );
    }
  }

  if (zona !== undefined && zona !== null && zona !== "") {
    const numZona = Number(zona);
    if (isNaN(numZona) || !Number.isInteger(numZona) || numZona <= 0) {
      return next(new BadRequestError("La zona especificada no es válida"));
    }
  }

  return next();
};
