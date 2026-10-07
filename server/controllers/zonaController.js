import { ZonaModel } from "../models/zonaModel.js";
import { ConflictError, NotFoundError } from "../utils/appError.js";
import { sendSuccess } from "../utils/apiResponse.js";

const esConflictoUnico = (error) =>
  error?.message?.includes("UNIQUE constraint failed");

// GET /api/zonas
export const obtenerZonas = async (req, res, next) => {
  try {
    const zonas = await ZonaModel.obtenerTodas();
    return sendSuccess(res, zonas);
  } catch (error) {
    return next(error);
  }
};

// GET /api/zonas/:id
export const obtenerZonaPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const zona = await ZonaModel.obtenerPorId(id);
    if (!zona) {
      throw new NotFoundError("Zona no encontrada");
    }
    return sendSuccess(res, zona);
  } catch (error) {
    return next(error);
  }
};

// POST /api/zonas (Solo Administradores)
export const crearZona = async (req, res, next) => {
  try {
    const { nombre } = req.body;
    const nuevaZona = await ZonaModel.crear({ nombre });

    return sendSuccess(res, nuevaZona, {
      status: 201,
      message: "Zona creada exitosamente",
    });
  } catch (error) {
    if (esConflictoUnico(error)) {
      return next(new ConflictError("Ya existe una zona con ese nombre"));
    }
    return next(error);
  }
};

// PUT /api/zonas/:id (Solo Administradores)
export const actualizarZona = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    const zonaExistente = await ZonaModel.obtenerPorId(id);
    if (!zonaExistente) {
      throw new NotFoundError("Zona no encontrada");
    }

    await ZonaModel.actualizar(id, { nombre });

    return sendSuccess(res, { id: Number(id), nombre }, {
      message: "Zona actualizada exitosamente",
    });
  } catch (error) {
    if (esConflictoUnico(error)) {
      return next(new ConflictError("Ya existe una zona con ese nombre"));
    }
    return next(error);
  }
};

// DELETE /api/zonas/:id (Solo Administradores)
export const eliminarZona = async (req, res, next) => {
  try {
    const { id } = req.params;

    const zonaExistente = await ZonaModel.obtenerPorId(id);
    if (!zonaExistente) {
      throw new NotFoundError("Zona no encontrada");
    }

    await ZonaModel.eliminar(id);

    return sendSuccess(res, null, {
      message: "Zona eliminada exitosamente",
    });
  } catch (error) {
    return next(error);
  }
};
