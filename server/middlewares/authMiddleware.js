import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/auth.js";
import { NOMBRE_COOKIE_TOKEN } from "../config/constants.js";
import { UnauthorizedError, ForbiddenError } from "../utils/appError.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies?.[NOMBRE_COOKIE_TOKEN];

  if (!token) {
    return next(
      new UnauthorizedError("Acceso no autorizado: No se encontró sesión activa"),
    );
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, rol }
    return next();
  } catch (error) {
    return next(new ForbiddenError("Sesión inválida o expirada"));
  }
};
