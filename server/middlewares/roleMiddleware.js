export const requireRole = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: "Acceso no autorizado: Debes iniciar sesión",
      });
    }

    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({
        error: `Acceso denegado: Se requiere uno de los siguientes roles [${rolesPermitidos.join(", ")}]`,
      });
    }

    next();
  };
};
