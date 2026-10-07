import { Router } from "express";
import {
  register,
  login,
  logout,
  getMe,
  actualizarPerfil,
  googleAuth,
  recuperarPassword,
  verificarCodigoRecuperacion,
  restablecerPassword,
  obtenerUltimoCorreo,
  listarUsuarios,
  eliminarUsuario,
} from "../controllers/authController.js";
import {
  validateRegister,
  validateLogin,
  validateActualizarPerfil,
} from "../middlewares/validateAuth.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/roleMiddleware.js";
import { validateIdParam } from "../middlewares/validateParams.js";
import { ROLES } from "../config/constants.js";

const router = Router();

// Rutas públicas
router.get("/config", (req, res) => {
  return res.json({
    success: true,
    data: {
      googleClientId: process.env.GOOGLE_CLIENT_ID || null,
    },
  });
});
router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/logout", logout);
router.post("/google", googleAuth);
router.get("/google-callback", (req, res) => {
  // Origen exacto al que se enviará el mensaje (evita targetOrigin '*').
  // Si no hay dominio configurado, se restringe al mismo origen de la ventana.
  const configuredOrigin =
    process.env.CLIENT_URL ||
    (process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",")[0].trim() : null);
  const targetOriginLiteral = configuredOrigin
    ? JSON.stringify(configuredOrigin)
    : "window.location.origin";

  res.send(`<!DOCTYPE html>
<html>
<head><title>Autenticación con Google</title></head>
<body>
<script>
  (function() {
    // Extraer token del fragmento hash de Google OAuth o de los query params
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash || window.location.search);
    const accessToken = params.get('access_token');
    const idToken = params.get('id_token');
    const targetOrigin = ${targetOriginLiteral};

    if (window.opener) {
      window.opener.postMessage({
        type: 'GOOGLE_AUTH_SUCCESS',
        access_token: accessToken,
        id_token: idToken
      }, targetOrigin);
      window.close();
    } else {
      window.location.href = '/pages/inicio.html';
    }
  })();
</script>
<p style="font-family: sans-serif; text-align: center; margin-top: 2rem;">Completando acceso con Google...</p>
</body>
</html>`);
});
router.post("/recuperar-password", recuperarPassword);
router.post("/verificar-codigo-recuperacion", verificarCodigoRecuperacion);
router.post("/restablecer-password", restablecerPassword);

// Rutas protegidas (requieren cookie con token válido)
router.get("/me", verifyToken, getMe);
router.put("/perfil", verifyToken, validateActualizarPerfil, actualizarPerfil);

// Rutas administrativas (solo rol admin, auditor para lectura)
router.get("/usuarios", verifyToken, requireRole(ROLES.ADMIN, ROLES.AUDITOR), listarUsuarios);
router.get("/ultimo-correo-enviado", verifyToken, requireRole(ROLES.ADMIN, ROLES.AUDITOR), obtenerUltimoCorreo);
router.delete("/usuarios/:id", verifyToken, requireRole(ROLES.ADMIN), validateIdParam, eliminarUsuario);

export default router;
