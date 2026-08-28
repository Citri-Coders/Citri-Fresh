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

const router = Router();

// Rutas públicas (Cualquier visitante puede ver el catálogo)
router.get("/", obtenerProductos);
router.get("/:id", obtenerProductoPorId);

// Rutas protegidas (Solo productores y administradores)
router.post(
  "/",
  verifyToken,
  requireRole("productor", "admin"),
  validateCrearProducto,
  crearProducto,
);

router.put(
  "/:id",
  verifyToken,
  requireRole("productor", "admin"),
  validateActualizarProducto,
  actualizarProducto,
);

router.delete(
  "/:id",
  verifyToken,
  requireRole("productor", "admin"),
  eliminarProducto,
);

export default router;
