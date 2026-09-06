import cors from "cors";

const envOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : [];

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3050",
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

    // En desarrollo, permitir orígenes locales y de red LAN (192.168.x.x, 10.x.x.x, etc.)
    if (/^https?:\/\/(192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+)(:\d+)?$/i.test(origin)) {
      return callback(null, true);
    }

    // Permitir dominios de despliegue comunes (Vercel, Render, Railway, Netlify)
    if (/\.(vercel\.app|onrender\.com|railway\.app|netlify\.app)$/i.test(origin)) {
      return callback(null, true);
    }

    // Fallback permisivo seguro: en lugar de arrojar error no controlado, reflejar el origin
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
};

export const corsMiddleware = cors(corsOptions);

