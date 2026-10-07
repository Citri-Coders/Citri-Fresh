export const validateCrearProducto = (req, res, next) => {
  const { nombre, precio, stock, zona } = req.body;

  if (!nombre || nombre.trim() === "") {
    return res
      .status(400)
      .json({ error: "El nombre del producto es obligatorio" });
  }

  if (typeof nombre === "string" && nombre.length > 100) {
    return res
      .status(400)
      .json({ error: "El nombre del producto no puede superar los 100 caracteres" });
  }

  const { descripcion } = req.body;
  if (typeof descripcion === "string" && descripcion.length > 1000) {
    return res
      .status(400)
      .json({ error: "La descripción no puede superar los 1000 caracteres" });
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

  if (nombre !== undefined && typeof nombre === "string" && nombre.length > 100) {
    return res
      .status(400)
      .json({ error: "El nombre del producto no puede superar los 100 caracteres" });
  }

  if (req.body.descripcion !== undefined && typeof req.body.descripcion === "string" && req.body.descripcion.length > 1000) {
    return res
      .status(400)
      .json({ error: "La descripción no puede superar los 1000 caracteres" });
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
