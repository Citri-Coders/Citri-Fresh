import { UnauthorizedError, ForbiddenError } from "../utils/appError.js";

export const requireRole = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new UnauthorizedError("Acceso no autorizado: Debes iniciar sesión"),
      );
    }

    if (!rolesPermitidos.includes(req.user.rol)) {
      return next(
        new ForbiddenError(
          `Acceso denegado: Se requiere uno de los siguientes roles [${rolesPermitidos.join(", ")}]`,
        ),
      );
    }

    return next();
  };
};
