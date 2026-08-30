import { Router } from "express";
import {
  crearPedido,
  obtenerPedidos,
  obtenerPedidoPorId,
  actualizarEstadoPedido,
} from "../controllers/pedidoController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/roleMiddleware.js";
import {
  validateCrearPedido,
  validateActualizarEstado,
} from "../middlewares/validatePedido.js";

const router = Router();

// Todas las rutas de pedidos requieren que el usuario haya iniciado sesión
router.use(verifyToken);

// Crear un nuevo pedido (Cualquier usuario autenticado / cliente)
router.post("/", validateCrearPedido, crearPedido);

// Listar pedidos (Cliente ve sus compras; Productor ve pedidos con sus productos; Admin ve todos)
router.get("/", obtenerPedidos);

// Ver detalle completo de un pedido con sus ítems
router.get("/:id", obtenerPedidoPorId);

// Cambiar el estado de un pedido (Solo productores y administradores)
router.patch(
  "/:id/estado",
  requireRole("productor", "admin"),
  validateActualizarEstado,
  actualizarEstadoPedido,
);

export default router;
