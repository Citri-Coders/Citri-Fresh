import logger from "./logger.js";
import "dotenv/config";
import crypto from "crypto";

// Configuración centralizada de autenticación JWT
// Único punto de verdad para secretos y opciones de cookies
// Nunca se deben incluir valores secretos por defecto en el código fuente.

let JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  if (process.env.NODE_ENV === "production") {
    // En produccion, fallar inmediatamente: sin JWT_SECRET no hay sesiones seguras
    throw new Error(
      "FATAL: JWT_SECRET no esta configurado. Definelo en las variables de entorno (Vercel/env) antes de desplegar a produccion.",
    );
  }
  // En desarrollo, generar una clave efimera para conveniencia
  JWT_SECRET = crypto.randomBytes(64).toString("hex");
  logger.warn(
    "ADVERTENCIA: JWT_SECRET no esta configurado. Se genero una clave efimera para desarrollo. Configura JWT_SECRET en .env para sesiones persistentes.",
  );
}

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

const ADMIN_ACCESS_KEY = process.env.ADMIN_ACCESS_KEY || null;

if (!ADMIN_ACCESS_KEY) {
  logger.warn(
    "⚠️ ADVERTENCIA: ADMIN_ACCESS_KEY no está configurada. El registro de administradores/auditores queda deshabilitado.",
  );
}

const SALT_ROUNDS = 10;

// Permite cookies cross-origin (frontend y backend en dominios distintos).
// "lax" (por defecto) sirve cuando ambos están en el mismo sitio; para dominios
// distintos debe usarse "none", que exige `secure` (HTTPS).
const COOKIE_SAME_SITE = (process.env.COOKIE_SAME_SITE || "lax").toLowerCase();
if (!["lax", "strict", "none"].includes(COOKIE_SAME_SITE)) {
  throw new Error(`COOKIE_SAME_SITE inválido: ${COOKIE_SAME_SITE}`);
}
const COOKIE_SECURE =
  process.env.NODE_ENV === "production" || COOKIE_SAME_SITE === "none";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: COOKIE_SECURE,
  sameSite: COOKIE_SAME_SITE,
  maxAge: 24 * 60 * 60 * 1000, // 1 día
};

const CLEAR_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: COOKIE_SECURE,
  sameSite: COOKIE_SAME_SITE,
};

export {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  ADMIN_ACCESS_KEY,
  SALT_ROUNDS,
  COOKIE_OPTIONS,
  CLEAR_COOKIE_OPTIONS,
};
