import express from "express";
import cookieParser from "cookie-parser";
import { corsMiddleware } from "./middlewares/corsMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import productoRoutes from "./routes/productoRoutes.js";

const app = express();

app.use(corsMiddleware);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/productos", productoRoutes);

// Middleware para rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada",
    path: req.originalUrl,
  });
});

// Middleware global de manejo de errores
app.use((err, req, res, next) => {
  console.error("Error no controlado:", err.message || err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || "Error interno del servidor",
  });
});

export default app;
