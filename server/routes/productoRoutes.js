import { Router } from "express";
import {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from "../controllers/productoController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/roleMiddleware.js";
import {
  validateCrearProducto,
  validateActualizarProducto,
} from "../middlewares/validateProducto.js";
import { validateIdParam } from "../middlewares/validateParams.js";
import { ROLES } from "../config/constants.js";

const router = Router();

// Rutas públicas (Cualquier visitante puede ver el catálogo)
router.get("/", obtenerProductos);
router.get("/:id", validateIdParam, obtenerProductoPorId);

// Rutas protegidas (Solo productores y administradores)
router.post(
  "/",
  verifyToken,
  requireRole(ROLES.PRODUCTOR, ROLES.ADMIN),
  validateCrearProducto,
  crearProducto,
);

router.put(
  "/:id",
  verifyToken,
  requireRole(ROLES.PRODUCTOR, ROLES.ADMIN),
  validateIdParam,
  validateActualizarProducto,
  actualizarProducto,
);

router.delete(
  "/:id",
  verifyToken,
  requireRole(ROLES.PRODUCTOR, ROLES.ADMIN),
  validateIdParam,
  eliminarProducto,
);

export default router;
