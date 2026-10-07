import { Router } from "express";
import {
  obtenerZonas,
  obtenerZonaPorId,
  crearZona,
  actualizarZona,
  eliminarZona,
} from "../controllers/zonaController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/roleMiddleware.js";
import {
  validateCrearZona,
  validateActualizarZona,
} from "../middlewares/validateZona.js";
import { validateIdParam } from "../middlewares/validateParams.js";
import { ROLES } from "../config/constants.js";

const router = Router();

// Rutas públicas (Cualquier usuario o el frontend puede consultar zonas)
router.get("/", obtenerZonas);
router.get("/:id", validateIdParam, obtenerZonaPorId);

// Rutas protegidas (Solo administradores pueden crear, modificar o eliminar zonas)
router.post(
  "/",
  verifyToken,
  requireRole(ROLES.ADMIN),
  validateCrearZona,
  crearZona,
);

router.put(
  "/:id",
  verifyToken,
  requireRole(ROLES.ADMIN),
  validateIdParam,
  validateActualizarZona,
  actualizarZona,
);

router.delete(
  "/:id",
  verifyToken,
  requireRole(ROLES.ADMIN),
  validateIdParam,
  eliminarZona,
);

export default router;
