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
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
};

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || isLocalhostOrigin(origin)) {
      callback(null, true);
    } else {
      const corsError = new Error(`Acceso bloqueado por política CORS: ${origin}`);
      corsError.status = 403;
      callback(corsError);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

export const corsMiddleware = cors(corsOptions);

