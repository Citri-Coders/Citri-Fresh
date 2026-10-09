import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/auth.js";
import { NOMBRE_COOKIE_TOKEN } from "../config/constants.js";
import { UnauthorizedError } from "../utils/appError.js";
import { UsuarioModel } from "../models/usuarioModel.js";

export const verifyToken = async (req, res, next) => {
  const token = req.cookies?.[NOMBRE_COOKIE_TOKEN];

  if (!token) {
    return next(
      new UnauthorizedError("Acceso no autorizado: No se encontró sesión activa"),
    );
  }

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] });
  } catch (error) {
    return next(new UnauthorizedError("Sesión inválida o expirada"));
  }

  if (
    !decoded ||
    typeof decoded !== "object" ||
    !Number.isSafeInteger(decoded.id) ||
    decoded.id <= 0
  ) {
    return next(new UnauthorizedError("Sesión inválida o expirada"));
  }

  try {
    const usuario = await UsuarioModel.findById(decoded.id);
    if (!usuario) {
      return next(new UnauthorizedError("La cuenta asociada a esta sesión ya no existe"));
    }

    // Consultar el rol vigente evita conservar privilegios obsoletos en un JWT
    // emitido antes de una degradación o cambio de cuenta.
    req.user = { id: Number(usuario.id), rol: usuario.rol };
    return next();
  } catch (error) {
    return next(error);
  }
};
