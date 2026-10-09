import { Router } from "express";
import {
  obtenerCarrito,
  agregarItem,
  actualizarItem,
  eliminarItem,
  vaciarCarrito,
  sincronizarCarrito,
} from "../controllers/carritoController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  validateProductoIdParam,
  validateAgregarItem,
  validateActualizarItem,
  validateSincronizar,
} from "../middlewares/validateCarrito.js";

const router = Router();

// Todo el carrito es por usuario: requiere sesión activa
router.use(verifyToken);

// Obtener el carrito del usuario autenticado
router.get("/", obtenerCarrito);

// Agregar un producto (incrementa cantidad si ya existe)
router.post("/", validateAgregarItem, agregarItem);

// Fusionar el carrito local (invitado) con el del servidor
router.post("/sincronizar", validateSincronizar, sincronizarCarrito);

// Fijar la cantidad exacta de un producto
router.put(
  "/:productoId",
  validateProductoIdParam,
  validateActualizarItem,
  actualizarItem,
);

// Vaciar todo el carrito
router.delete("/", vaciarCarrito);

// Quitar un producto del carrito
router.delete("/:productoId", validateProductoIdParam, eliminarItem);

export default router;
