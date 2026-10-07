export const validateCrearZona = (req, res, next) => {
  const { nombre } = req.body;

  if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
    return res
      .status(400)
      .json({ error: "El nombre de la zona es obligatorio" });
  }

  if (nombre.length > 100) {
    return res
      .status(400)
      .json({ error: "El nombre de la zona no puede superar los 100 caracteres" });
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

  if (nombre.length > 100) {
    return res
      .status(400)
      .json({ error: "El nombre de la zona no puede superar los 100 caracteres" });
  }

  req.body.nombre = nombre.trim();
  next();
};
