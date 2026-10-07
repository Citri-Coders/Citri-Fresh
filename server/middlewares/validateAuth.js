import { validarCorreoReal } from "../utils/emailValidator.js";
import { BadRequestError } from "../utils/appError.js";
import { ROLES_VALIDOS, LIMITES_CAMPOS } from "../config/constants.js";

// Devuelve un mensaje de error si algún campo excede su longitud máxima, o null.
const validarLongitudes = (body, campos) => {
  for (const campo of campos) {
    const valor = body[campo];
    const max = LIMITES_CAMPOS[campo];
    if (typeof valor === "string" && max && valor.length > max) {
      return `El campo '${campo}' no puede superar los ${max} caracteres`;
    }
  }
  return null;
};

export const validateRegister = async (req, res, next) => {
  try {
    const { nombre, email, password, rol } = req.body;

    if (!nombre || !email || !password) {
      return next(
        new BadRequestError("Nombre, email y contraseña son obligatorios"),
      );
    }

    const errorLongitud = validarLongitudes(req.body, [
      "nombre",
      "email",
      "password",
      "telefono",
      "direccion",
      "nombre_finca",
      "zona_cultivo",
      "capacidad_produccion",
      "tipos_citricos",
      "foto",
    ]);
    if (errorLongitud) {
      return next(new BadRequestError(errorLongitud));
    }

    // Verificación profunda y real del correo (sintaxis, no-desechable y servidor MX)
    const verificacion = await validarCorreoReal(email);
    if (!verificacion.valido) {
      return next(new BadRequestError(verificacion.error));
    }

    if (password.length < 6) {
      return next(
        new BadRequestError("La contraseña debe tener al menos 6 caracteres"),
      );
    }

    if (rol && !ROLES_VALIDOS.includes(rol)) {
      return next(new BadRequestError("Rol no válido"));
    }

    // Guardar correo normalizado
    req.body.email = verificacion.email;
    return next();
  } catch (error) {
    return next(error);
  }
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Email y contraseña son obligatorios"));
  }

  const errorLongitud = validarLongitudes(req.body, ["email", "password"]);
  if (errorLongitud) {
    return next(new BadRequestError(errorLongitud));
  }

  return next();
};

export const validateActualizarPerfil = async (req, res, next) => {
  try {
    const { nombre, email, password_actual, password_nuevo } = req.body;

    const errorLongitud = validarLongitudes(req.body, [
      "nombre",
      "email",
      "password_actual",
      "password_nuevo",
      "telefono",
      "direccion",
      "foto",
    ]);
    if (errorLongitud) {
      return next(new BadRequestError(errorLongitud));
    }

    if (
      nombre !== undefined &&
      (typeof nombre !== "string" || nombre.trim() === "")
    ) {
      return next(new BadRequestError("El nombre no puede estar vacío"));
    }

    if (email !== undefined) {
      const verificacion = await validarCorreoReal(email);
      if (!verificacion.valido) {
        return next(new BadRequestError(verificacion.error));
      }
      req.body.email = verificacion.email;
    }

    if (password_nuevo !== undefined) {
      if (!password_actual) {
        return next(
          new BadRequestError(
            "Debes ingresar tu contraseña actual para cambiarla",
          ),
        );
      }

      if (typeof password_nuevo !== "string" || password_nuevo.length < 6) {
        return next(
          new BadRequestError(
            "La nueva contraseña debe tener al menos 6 caracteres",
          ),
        );
      }
    }

    return next();
  } catch (error) {
    return next(error);
  }
};
