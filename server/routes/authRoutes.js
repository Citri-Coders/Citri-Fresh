import { Router } from "express";
import {
  register,
  login,
  logout,
  getMe,
} from "../controllers/authController.js";
import {
  validateRegister,
  validateLogin,
} from "../middlewares/validateAuth.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = Router();

// Rutas públicas
router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/logout", logout);

// Ruta protegida (requiere cookie con token válido)
router.get("/me", verifyToken, getMe);

export default router;
