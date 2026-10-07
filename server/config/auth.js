import "dotenv/config";
import crypto from "crypto";

// Configuración centralizada de autenticación JWT
// Único punto de verdad para secretos y opciones de cookies
// Nunca se deben incluir valores secretos por defecto en el código fuente.

let JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET es obligatorio en producción");
  }
  // En desarrollo se genera una clave efímera (las sesiones se invalidan al reiniciar)
  JWT_SECRET = crypto.randomBytes(64).toString("hex");
  console.warn(
    "⚠️ ADVERTENCIA: JWT_SECRET no está configurada. Se generó una clave efímera de desarrollo; configura JWT_SECRET en tu .env para sesiones persistentes.",
  );
}

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

const ADMIN_ACCESS_KEY = process.env.ADMIN_ACCESS_KEY || null;

if (!ADMIN_ACCESS_KEY) {
  console.warn(
    "⚠️ ADVERTENCIA: ADMIN_ACCESS_KEY no está configurada. El registro de administradores/auditores queda deshabilitado.",
  );
}

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
