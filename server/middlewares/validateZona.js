export const validateCrearZona = (req, res, next) => {
  const { nombre } = req.body;

  if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
    return res
      .status(400)
      .json({ error: "El nombre de la zona es obligatorio" });
  }

  req.body.nombre = nombre.trim();
  next();
};

export const validateActualizarZona = (req, res, next) => {
  const { nombre } = req.body;

  if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
    return res
      .status(400)
      .json({ error: "El nuevo nombre de la zona es obligatorio" });
  }

  req.body.nombre = nombre.trim();
  next();
};
