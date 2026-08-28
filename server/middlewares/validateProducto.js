export const validateCrearProducto = (req, res, next) => {
  const { nombre, precio, stock, zona } = req.body;

  if (!nombre || nombre.trim() === "") {
    return res
      .status(400)
      .json({ error: "El nombre del producto es obligatorio" });
  }

  if (precio === undefined || precio === null || precio === "") {
    return res.status(400).json({ error: "El precio es obligatorio" });
  }

  if (stock === undefined || stock === null || stock === "") {
    return res.status(400).json({ error: "El stock es obligatorio" });
  }

  const numPrecio = Number(precio);
  if (isNaN(numPrecio) || numPrecio < 0) {
    return res
      .status(400)
      .json({ error: "El precio debe ser un número no negativo" });
  }

  const numStock = Number(stock);
  if (isNaN(numStock) || !Number.isInteger(numStock) || numStock < 0) {
    return res
      .status(400)
      .json({ error: "El stock debe ser un número entero no negativo" });
  }

  if (zona !== undefined && zona !== null && zona !== "") {
    const numZona = Number(zona);
    if (isNaN(numZona) || !Number.isInteger(numZona) || numZona <= 0) {
      return res
        .status(400)
        .json({ error: "La zona especificada no es válida" });
    }
  }

  next();
};

export const validateActualizarProducto = (req, res, next) => {
  const { nombre, precio, stock, zona } = req.body;

  if (nombre !== undefined && nombre.trim() === "") {
    return res
      .status(400)
      .json({ error: "El nombre del producto no puede estar vacío" });
  }

  if (precio !== undefined) {
    const numPrecio = Number(precio);
    if (isNaN(numPrecio) || numPrecio < 0) {
      return res
        .status(400)
        .json({ error: "El precio debe ser un número no negativo" });
    }
  }

  if (stock !== undefined) {
    const numStock = Number(stock);
    if (isNaN(numStock) || !Number.isInteger(numStock) || numStock < 0) {
      return res
        .status(400)
        .json({ error: "El stock debe ser un número entero no negativo" });
    }
  }

  if (zona !== undefined && zona !== null && zona !== "") {
    const numZona = Number(zona);
    if (isNaN(numZona) || !Number.isInteger(numZona) || numZona <= 0) {
      return res
        .status(400)
        .json({ error: "La zona especificada no es válida" });
    }
  }

  next();
};
