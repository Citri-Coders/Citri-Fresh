import cors from "cors";

const envOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : [];

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3050",
  "http://localhost:3051",
  "http://127.0.0.1:3050",
  "http://localhost:5173",
  process.env.CLIENT_URL,
  ...envOrigins,
].filter(Boolean);

const isLocalhostOrigin = (origin) => {
  return /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])(:\d+)?$/i.test(origin);
};

const corsOptions = {
  origin: (origin, callback) => {
    // Si no hay origin (mismo origen, Postman, cURL, peticiones directas o locales)
    if (!origin) {
      return callback(null, true);
    }

    // Si es localhost o 127.0.0.1 con cualquier puerto
    if (isLocalhostOrigin(origin)) {
      return callback(null, true);
    }

    // Si está en la lista de orígenes explícitos
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Permitir automáticamente orígenes de Vercel (*.vercel.app)
    if (/\.vercel\.app$/i.test(origin)) {
      return callback(null, true);
    }

    // En desarrollo, permitir orígenes de red LAN (192.168.x.x, 10.x.x.x, etc.)
    if (
      process.env.NODE_ENV !== "production" &&
      /^https?:\/\/(192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+)(:\d+)?$/i.test(origin)
    ) {
      return callback(null, true);
    }

    // En producción solo se permiten los orígenes explícitos de ALLOWED_ORIGINS/CLIENT_URL
    const error = new Error("Origen no permitido por CORS");
    error.code = "CORS_ORIGIN_DENIED";
    return callback(error, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
};

const corsHandler = cors(corsOptions);

export const corsMiddleware = (req, res, next) => {
  const isOpaqueOriginLogoutForm =
    req.method === "POST" &&
    req.path === "/api/auth/logout" &&
    req.get("origin") === "null" &&
    req.get("content-type")?.startsWith("application/x-www-form-urlencoded");

  // Las navegaciones por formulario no necesitan permisos CORS para leer la
  // respuesta. Permitir este caso evita convertir el logout en un 500 cuando
  // la app se abre desde un origen opaco (por ejemplo, file://), sin autorizar
  // ese origen para llamadas fetch/XHR con credenciales.
  if (isOpaqueOriginLogoutForm) {
    return next();
  }

  return corsHandler(req, res, (error) => {
    if (error?.code === "CORS_ORIGIN_DENIED") {
      return res.status(403).json({
        success: false,
        error: "Origen no permitido por CORS",
      });
    }
    return next(error);
  });
};

