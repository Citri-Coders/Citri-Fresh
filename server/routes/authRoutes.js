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

const router = Router();

// Rutas públicas
router.get("/config", (req, res) => {
  res.json({
    googleClientId: process.env.GOOGLE_CLIENT_ID || "1096747808728-qs9egmbcrfuam09vvu3d36140f5mqr3c.apps.googleusercontent.com"
  });
});
router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/logout", logout);
router.post("/google", googleAuth);
router.get("/google-callback", (req, res) => {
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
    
    if (window.opener) {
      window.opener.postMessage({
        type: 'GOOGLE_AUTH_SUCCESS',
        access_token: accessToken,
        id_token: idToken
      }, '*');
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
router.get("/ultimo-correo-enviado", obtenerUltimoCorreo);

// Rutas protegidas (requieren cookie con token válido)
router.get("/me", verifyToken, getMe);
router.put("/perfil", verifyToken, validateActualizarPerfil, actualizarPerfil);

// Rutas administrativas (solo rol admin, auditor para lectura)
router.get("/usuarios", verifyToken, requireRole("admin", "auditor"), listarUsuarios);
router.delete("/usuarios/:id", verifyToken, requireRole("admin"), eliminarUsuario);

export default router;
