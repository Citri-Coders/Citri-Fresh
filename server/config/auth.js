import "dotenv/config";

// Configuración centralizada de autenticación JWT
// Único punto de verdad para secretos y opciones de cookies

const JWT_SECRET =
  process.env.JWT_SECRET || "citrifresh_secret_key_super_segura_desarrollo_2026";

if (!process.env.JWT_SECRET) {
  console.warn(
    "⚠️ ADVERTENCIA: La variable de entorno JWT_SECRET no está configurada. Usando clave de respaldo para mantener el servicio activo.",
  );
}

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

const ADMIN_ACCESS_KEY = process.env.ADMIN_ACCESS_KEY || "CITRI_MASTER_ADMIN_2026!";

const SALT_ROUNDS = 10;

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 24 * 60 * 60 * 1000, // 1 día
};

const CLEAR_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
};

export {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  ADMIN_ACCESS_KEY,
  SALT_ROUNDS,
  COOKIE_OPTIONS,
  CLEAR_COOKIE_OPTIONS,
};
