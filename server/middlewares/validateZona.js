import { BadRequestError } from "../utils/appError.js";
import { LIMITES_CAMPOS } from "../config/constants.js";

export const validateCrearZona = (req, res, next) => {
  const { nombre } = req.body;

  if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
    return next(new BadRequestError("El nombre de la zona es obligatorio"));
  }

  if (nombre.length > LIMITES_CAMPOS.nombre) {
    return next(
      new BadRequestError(
        `El nombre de la zona no puede superar los ${LIMITES_CAMPOS.nombre} caracteres`,
      ),
    );
  }

  req.body.nombre = nombre.trim();
  return next();
};

export const validateActualizarZona = (req, res, next) => {
  const { nombre } = req.body;

  if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
    return next(
      new BadRequestError("El nuevo nombre de la zona es obligatorio"),
    );
  }

  if (nombre.length > LIMITES_CAMPOS.nombre) {
    return next(
      new BadRequestError(
        `El nombre de la zona no puede superar los ${LIMITES_CAMPOS.nombre} caracteres`,
      ),
    );
  }

  req.body.nombre = nombre.trim();
  return next();
};
