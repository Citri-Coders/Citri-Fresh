import logger from "./logger.js";
import "dotenv/config";
import crypto from "crypto";

// Configuración centralizada de autenticación JWT
// Único punto de verdad para secretos y opciones de cookies
// Nunca se deben incluir valores secretos por defecto en el código fuente.

let JWT_SECRET = process.env.JWT_SECRET;

if (process.env.NODE_ENV === "production" && (!JWT_SECRET || JWT_SECRET.length < 32)) {
  throw new Error("JWT_SECRET debe configurarse en producción con al menos 32 caracteres");
}

if (!JWT_SECRET) {
  // En desarrollo y pruebas se genera una clave efímera si no se configuró.
  JWT_SECRET = crypto.randomBytes(64).toString("hex");
  logger.warn(
    "JWT_SECRET no está configurado; se generó una clave temporal para este proceso.",
  );
}

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

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
  path: "/",
};

const CLEAR_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: COOKIE_SECURE,
  sameSite: COOKIE_SAME_SITE,
  path: "/",
};

export {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  SALT_ROUNDS,
  COOKIE_OPTIONS,
  CLEAR_COOKIE_OPTIONS,
};
