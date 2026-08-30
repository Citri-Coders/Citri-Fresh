const ESTADOS_VALIDOS = [
  "pendiente",
  "pagado",
  "enviado",
  "completado",
  "cancelado",
];

export const validateCrearPedido = (req, res, next) => {
  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      error: "El pedido debe contener un arreglo de ítems no vacío",
    });
  }

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    if (!item.producto_id || isNaN(Number(item.producto_id))) {
      return res.status(400).json({
        error: `El ítem en la posición ${i} debe tener un 'producto_id' válido`,
      });
    }

    const cantidad = Number(item.cantidad);
    if (isNaN(cantidad) || !Number.isInteger(cantidad) || cantidad <= 0) {
      return res.status(400).json({
        error: `La cantidad del producto con ID ${item.producto_id} debe ser un número entero mayor a 0`,
      });
    }

    // Normalizar tipos
    item.producto_id = Number(item.producto_id);
    item.cantidad = cantidad;
  }

  next();
};

export const validateActualizarEstado = (req, res, next) => {
  const { estado } = req.body;

  if (!estado || typeof estado !== "string") {
    return res.status(400).json({
      error: "El campo 'estado' es obligatorio",
    });
  }

  const estadoNormalizado = estado.trim().toLowerCase();

  if (!ESTADOS_VALIDOS.includes(estadoNormalizado)) {
    return res.status(400).json({
      error: `Estado inválido. Los estados permitidos son: [${ESTADOS_VALIDOS.join(", ")}]`,
    });
  }

  req.body.estado = estadoNormalizado;
  next();
};
