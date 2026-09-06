import { rateLimit } from "express-rate-limit";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    res.status(429).json({
      error: "Rate limit excedido",
      message: err.message || "Has realizado demasiadas peticiones. Por favor, espera.",
      retryAfter: err.retryAfter || 60,
    });
  } else {
    next(err);
  }
};

export { generalLimiter, authLimiter, rateLimitErrorHandler };
