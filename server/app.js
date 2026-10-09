import logger from "./config/logger.js";
import { AppError } from "./utils/appError.js";
import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { corsMiddleware } from "./middlewares/corsMiddleware.js";
import { generalLimiter, authLimiter, passwordResetLimiter, googleAuthLimiter, rateLimitErrorHandler } from "./middlewares/rateLimitMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import productoRoutes from "./routes/productoRoutes.js";
import pedidoRoutes from "./routes/pedidoRoutes.js";
import zonaRoutes from "./routes/zonaRoutes.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const app = express();

// Confianza en proxies inversos (necesario para Vercel / serverless y rate-limiters)
app.set("trust proxy", 1);

// Seguridad: headers HTTP de proteccion (clickjacking, MIME sniffing, HSTS, etc.)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://accounts.google.com", "https://apis.google.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https://accounts.google.com", "https://www.googleapis.com", "https://oauth2.googleapis.com"],
      frameSrc: ["'self'", "https://accounts.google.com"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));


app.use(corsMiddleware);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Servir archivos estáticos del frontend (HTML, CSS, JS, imágenes) primero
app.use(express.static(path.join(rootDir, "src")));
app.use("/public", express.static(path.join(rootDir, "public")));
app.use("/assets", express.static(path.join(rootDir, "public")));
app.use("/images", express.static(path.join(rootDir, "public", "images")));

// Aplicar rate limiting general exclusivamente a la API
app.use("/api", generalLimiter);

// Aplicar rate limiting más estricto a rutas de autenticación
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/auth/google", googleAuthLimiter);
app.use("/api/auth/recuperar-password", passwordResetLimiter);

// Rutas de favicon oficiales del sistema
app.get("/favicon.ico", (req, res) => {
  res.sendFile(path.join(rootDir, "public", "images", "favicon.svg"));
});
app.get("/favicon.svg", (req, res) => {
  res.sendFile(path.join(rootDir, "public", "images", "favicon.svg"));
});

// Redirección de la raíz y del entrypoint serverless al inicio de la aplicación
app.get(["/", "/server.js", "/index.html"], (req, res) => {
  res.redirect("/pages/inicio.html");
});

// URLS base
app.use("/api/auth", authRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/pedidos", pedidoRoutes);
app.use("/api/zonas", zonaRoutes);

// Middleware para manejo de errores de rate limiting
app.use(rateLimitErrorHandler);

// Middleware global de manejo de errores — formato de error estandarizado
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const esOperacional = err instanceof AppError;
  const status = esOperacional ? err.statusCode : 500;

  if (esOperacional) {
    logger.warn({ err, path: req.originalUrl }, err.message);
  } else {
    logger.error({ err, path: req.originalUrl }, "Error no controlado");
  }

  const body = {
    success: false,
    error: esOperacional ? err.message : "Error interno del servidor",
  };
  if (esOperacional && err.details !== undefined) {
    body.details = err.details;
  }

  return res.status(status).json(body);
});

// Middleware para rutas no encontradas (404) — debe ir al final
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    error: "Ruta no encontrada",
    path: req.originalUrl,
  });
});

export default app;
