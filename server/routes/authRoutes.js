import { Router } from "express";
import {
  register,
  login,
  logout,
  getMe,
  actualizarPerfil,
} from "../controllers/authController.js";
import {
  validateRegister,
  validateLogin,
  validateActualizarPerfil,
} from "../middlewares/validateAuth.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = Router();

// Rutas públicas
router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/logout", logout);

// Rutas protegidas (requieren cookie con token válido)
router.get("/me", verifyToken, getMe);
router.put("/perfil", verifyToken, validateActualizarPerfil, actualizarPerfil);

export default router;
