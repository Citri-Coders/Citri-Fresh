import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "citrifresh_secret_key_super_segura";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ error: "Acceso no autorizado: No se encontró sesión activa" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, rol }
    next();
  } catch (error) {
    return res.status(403).json({ error: "Sesión inválida o expirada" });
  }
};
