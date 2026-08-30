import { ZonaModel } from "../models/zonaModel.js";

// GET /api/zonas
export const obtenerZonas = async (req, res) => {
  try {
    const zonas = await ZonaModel.obtenerTodas();
    return res.status(200).json(zonas);
  } catch (error) {
    console.error("Error al obtener zonas:", error);
    return res
      .status(500)
      .json({ error: "Error interno al obtener las zonas" });
  }
};

// GET /api/zonas/:id
export const obtenerZonaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const zona = await ZonaModel.obtenerPorId(id);

    if (!zona) {
      return res.status(404).json({ error: "Zona no encontrada" });
    }

    return res.status(200).json(zona);
  } catch (error) {
    console.error("Error al obtener zona por ID:", error);
    return res
      .status(500)
      .json({ error: "Error interno al buscar la zona" });
  }
};

// POST /api/zonas (Solo Administradores)
export const crearZona = async (req, res) => {
  try {
    const { nombre } = req.body;

    const nuevaZona = await ZonaModel.crear({ nombre });

    return res.status(201).json({
      message: "Zona creada exitosamente",
      zona: nuevaZona,
    });
  } catch (error) {
    console.error("Error al crear zona:", error);

    if (error.message && error.message.includes("UNIQUE constraint failed")) {
      return res
        .status(409)
        .json({ error: "Ya existe una zona con ese nombre" });
    }

    return res
      .status(500)
      .json({ error: "Error interno al crear la zona" });
  }
};

// PUT /api/zonas/:id (Solo Administradores)
export const actualizarZona = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    const zonaExistente = await ZonaModel.obtenerPorId(id);
    if (!zonaExistente) {
      return res.status(404).json({ error: "Zona no encontrada" });
    }

    await ZonaModel.actualizar(id, { nombre });

    return res.status(200).json({
      message: "Zona actualizada exitosamente",
      zona: {
        id: Number(id),
        nombre,
      },
    });
  } catch (error) {
    console.error("Error al actualizar zona:", error);

    if (error.message && error.message.includes("UNIQUE constraint failed")) {
      return res
        .status(409)
        .json({ error: "Ya existe una zona con ese nombre" });
    }

    return res
      .status(500)
      .json({ error: "Error interno al actualizar la zona" });
  }
};

// DELETE /api/zonas/:id (Solo Administradores)
export const eliminarZona = async (req, res) => {
  try {
    const { id } = req.params;

    const zonaExistente = await ZonaModel.obtenerPorId(id);
    if (!zonaExistente) {
      return res.status(404).json({ error: "Zona no encontrada" });
    }

    await ZonaModel.eliminar(id);

    return res.status(200).json({
      message: "Zona eliminada exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar zona:", error);
    return res
      .status(500)
      .json({ error: "Error interno al eliminar la zona" });
  }
};
