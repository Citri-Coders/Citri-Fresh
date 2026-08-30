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

const router = Router();

// Rutas públicas (Cualquier usuario o el frontend puede consultar zonas)
router.get("/", obtenerZonas);
router.get("/:id", obtenerZonaPorId);

// Rutas protegidas (Solo administradores pueden crear, modificar o eliminar zonas)
router.post(
  "/",
  verifyToken,
  requireRole("admin"),
  validateCrearZona,
  crearZona,
);

router.put(
  "/:id",
  verifyToken,
  requireRole("admin"),
  validateActualizarZona,
  actualizarZona,
);

router.delete(
  "/:id",
  verifyToken,
  requireRole("admin"),
  eliminarZona,
);

export default router;
