import { rateLimit } from "express-rate-limit";

// Configuración por defecto
const DEFAULT_WINDOW_MS = process.env.RATE_LIMIT_WINDOW_MS
  ? parseInt(process.env.RATE_LIMIT_WINDOW_MS)
  : 15 * 60 * 1000; // 15 minutos en ms

const DEFAULT_MAX_REQUESTS = process.env.RATE_LIMIT_MAX_REQUESTS
  ? parseInt(process.env.RATE_LIMIT_MAX_REQUESTS)
  : 100; // 100 peticiones por ventana

const DEFAULT_LOGIN_MAX_REQUESTS = process.env.RATE_LIMIT_LOGIN_MAX_REQUESTS
  ? parseInt(process.env.RATE_LIMIT_LOGIN_MAX_REQUESTS)
  : 5; // 5 peticiones por minuto para login

const LOGIN_WINDOW_MS = 60 * 1000; // 1 minuto para login

// Middleware de rate limiting general para rutas de la API (excluyendo estáticos)
const generalLimiter = rateLimit({
  windowMs: DEFAULT_WINDOW_MS,
  max: process.env.NODE_ENV === "development" ? 2000 : DEFAULT_MAX_REQUESTS,
  message: {
    error: "Demasiadas peticiones",
    message: `Has excedido el límite de peticiones por cada ${DEFAULT_WINDOW_MS / 60000} minutos. Por favor, espera un momento y vuelve a intentarlo.`,
    retryAfter: "1 minuto"
  },
  skip: (req) => {
    // No limitar llamadas a archivos estáticos (html, css, js, imágenes, fuentes, favicon)
    if (!req.path.startsWith("/api/")) return true;
    // En desarrollo local no penalizar navegación del desarrollador
    if (process.env.NODE_ENV === "development" && (req.ip === "127.0.0.1" || req.ip === "::1" || req.ip === "::ffff:127.0.0.1")) {
      return true;
    }
    return false;
  },
  headers: true,
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware de rate limiting más estricto para endpoints de autenticación
const authLimiter = rateLimit({
  windowMs: LOGIN_WINDOW_MS,
  max: process.env.NODE_ENV === "development" ? 50 : DEFAULT_LOGIN_MAX_REQUESTS,
  message: {
    error: "Demasiados intentos de autenticación",
    message: `Has excedido el límite de intentos de autenticación por minuto. Por favor, espera antes de intentar de nuevo.`,
    retryAfter: "1 minuto"
  },
  skip: (req) => {
    // No aplicar rate limiting al endpoint de configuración pública de Google ni en entorno de pruebas local
    if (req.path === "/api/auth/config") return true;
    if (process.env.NODE_ENV === "development" && (req.ip === "127.0.0.1" || req.ip === "::1" || req.ip === "::ffff:127.0.0.1")) {
      return true;
    }
    return false;
  },
  headers: true,
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware para manejo de errores de rate limiting
const rateLimitErrorHandler = (err, req, res, next) => {
  if (err.statusCode === 429) {
    return res.status(429).json({
      success: false,
      error: err.message || "Has realizado demasiadas peticiones. Por favor, espera.",
      retryAfter: err.retryAfter || 60,
    });
  }
  next(err);
};

// Middleware de rate limiting estricto para recuperación de contraseña (3 solicitudes por hora)
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: process.env.NODE_ENV === "development" ? 20 : 3,
  message: {
    error: "Demasiadas solicitudes de recuperación",
    message: "Has excedido el límite de solicitudes de recuperación de contraseña. Por favor, espera una hora antes de intentar de nuevo.",
    retryAfter: "1 hora"
  },
  skip: (req) => {
    if (process.env.NODE_ENV === "development" && (req.ip === "127.0.0.1" || req.ip === "::1" || req.ip === "::ffff:127.0.0.1")) {
      return true;
    }
    return false;
  },
  headers: true,
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware de rate limiting para autenticación con Google (10/minuto)
const googleAuthLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: process.env.NODE_ENV === "development" ? 50 : 10,
  message: {
    error: "Demasiados intentos de autenticación con Google",
    message: "Has excedido el límite de intentos de autenticación con Google. Por favor, espera un momento.",
    retryAfter: "1 minuto"
  },
  skip: (req) => {
    if (process.env.NODE_ENV === "development" && (req.ip === "127.0.0.1" || req.ip === "::1" || req.ip === "::ffff:127.0.0.1")) {
      return true;
    }
    return false;
  },
  headers: true,
  standardHeaders: true,
  legacyHeaders: false,
});

export { generalLimiter, authLimiter, passwordResetLimiter, googleAuthLimiter, rateLimitErrorHandler };
