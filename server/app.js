import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import { corsMiddleware } from "./middlewares/corsMiddleware.js";
import { generalLimiter, authLimiter, rateLimitErrorHandler } from "./middlewares/rateLimitMiddleware.js";
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

app.use(corsMiddleware);
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));
app.use(cookieParser());

// Servir archivos estáticos del frontend (HTML, CSS, JS, imágenes) primero
app.use(express.static(path.join(rootDir, "src")));
app.use("/public", express.static(path.join(rootDir, "public")));

// Aplicar rate limiting general exclusivamente a la API
app.use("/api", generalLimiter);

// Aplicar rate limiting más estricto a rutas de autenticación
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

// Rutas de favicon oficiales del sistema
app.get("/favicon.ico", (req, res) => {
  res.sendFile(path.join(rootDir, "public", "images", "favicon.svg"));
});
app.get("/favicon.svg", (req, res) => {
  res.sendFile(path.join(rootDir, "public", "images", "favicon.svg"));
});

// Redirección de la raíz al inicio de la aplicación
app.get("/", (req, res) => {
  res.redirect("/pages/inicio.html");
});

// URLS base
app.use("/api/auth", authRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/pedidos", pedidoRoutes);
app.use("/api/zonas", zonaRoutes);

// Middleware para rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada",
    path: req.originalUrl,
  });
});

// Middleware para manejo de errores de rate limiting
app.use(rateLimitErrorHandler);

// Middleware global de manejo de errores
app.use((err, req, res, next) => {
  console.error("Error no controlado:", err.message || err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || "Error interno del servidor",
  });
});

export default app;
