/**
 * Middleware reutilizable para validar que req.params.id sea un entero positivo.
 * Evita que IDs inválidos (letras, negativos, decimales) lleguen a las queries SQL
 * y provoquen errores 500 en vez de un 400 limpio.
 */
export const validateIdParam = (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "El ID proporcionado no es válido" });
  }
  req.params.id = id;
  next();
};
