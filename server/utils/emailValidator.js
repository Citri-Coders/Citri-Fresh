import dns from "dns/promises";

// Dominios desechables o temporales conocidos comunmente usados para spam o bots
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "10minutemail.com",
  "tempmail.com",
  "guerrillamail.com",
  "yopmail.com",
  "throwawaymail.com",
  "getairmail.com",
  "trashmail.com",
  "sharklasers.com",
  "dispostable.com",
  "mytemp.email",
  "tempail.com",
  "fakeinbox.com",
  "generator.email",
  "temp-mail.org",
  "mohmal.com",
  "burnermail.io",
  "inboxkitten.com"
]);

const RESERVED_EMAIL_DOMAINS = new Set([
  "example.com",
  "example.net",
  "example.org",
]);
const RESERVED_EMAIL_SUFFIXES = [
  ".example",
  ".invalid",
  ".localhost",
  ".local",
  ".test",
];

const DNS_NO_RECORD_CODES = new Set(["ENODATA", "NODATA", "ENOTFOUND"]);
const DNS_TEMPORARY_ERROR_CODES = new Set([
  "DNS_TIMEOUT",
  "EAI_AGAIN",
  "ECONNREFUSED",
  "ESERVFAIL",
  "ETIMEOUT",
]);
const DNS_TIMEOUT_MS = 3000;

const isReservedEmailDomain = (domain) =>
  RESERVED_EMAIL_DOMAINS.has(domain) ||
  [...RESERVED_EMAIL_DOMAINS].some((reserved) => domain.endsWith(`.${reserved}`)) ||
  RESERVED_EMAIL_SUFFIXES.some((suffix) => domain.endsWith(suffix));

const withDnsTimeout = (promise, timeoutMs) => {
  let timeoutId;
  const timeout = new Promise((resolve, reject) => {
    timeoutId = setTimeout(() => {
      const error = new Error("DNS_TIMEOUT");
      error.code = "DNS_TIMEOUT";
      reject(error);
    }, timeoutMs);
  });

  return Promise.race([promise, timeout]).finally(() => clearTimeout(timeoutId));
};

async function hasMailRoute(domain, resolver, timeoutMs) {
  let mxRecords = [];
  try {
    mxRecords = await withDnsTimeout(resolver.resolveMx(domain), timeoutMs);
  } catch (error) {
    if (error.code === "ENOTFOUND") return false;
    if (!DNS_NO_RECORD_CODES.has(error.code)) throw error;
  }

  if (mxRecords?.length) {
    // Un registro MX con exchange "." es un Null MX explícito: el dominio no
    // acepta correo y no debe validarse mediante el fallback A/AAAA.
    return mxRecords.some(
      (record) => typeof record.exchange === "string" && record.exchange !== ".",
    );
  }

  const addressResults = await Promise.allSettled([
    withDnsTimeout(resolver.resolve4(domain), timeoutMs),
    withDnsTimeout(resolver.resolve6(domain), timeoutMs),
  ]);

  if (
    addressResults.some(
      (result) => result.status === "fulfilled" && result.value?.length > 0,
    )
  ) {
    return true;
  }

  const temporaryFailure = addressResults.find(
    (result) =>
      result.status === "rejected" &&
      !DNS_NO_RECORD_CODES.has(result.reason?.code),
  );
  if (temporaryFailure) throw temporaryFailure.reason;

  return false;
}

/**
 * Valida un correo electrónico en múltiples niveles:
 * 1. Formato sintáctico estricto (RFC 5322 compatible)
 * 2. Longitud y caracteres permitidos
 * 3. Bloqueo de proveedores de correo desechables / bots
 * 4. Comprueba que el dominio tenga MX o, como fallback, registros A/AAAA
 */
export async function validarCorreoReal(
  email,
  { resolver = dns, nodeEnv = process.env.NODE_ENV, timeoutMs = DNS_TIMEOUT_MS } = {},
) {
  if (!email || typeof email !== "string") {
    return { valido: false, error: "El correo electrónico es obligatorio." };
  }

  const emailTrim = email.trim().toLowerCase();

  // 1. Longitud
  if (emailTrim.length < 5 || emailTrim.length > 254) {
    return { valido: false, error: "La longitud del correo electrónico no es válida." };
  }

  // 2. Sintaxis: no permite puntos iniciales/finales ni puntos consecutivos
  // en la parte local; cada etiqueta del dominio debe respetar límites DNS.
  const parts = emailTrim.split("@");
  if (parts.length !== 2) {
    return { valido: false, error: "Formato de correo no válido." };
  }

  const [usuario, dominio] = parts;
  const regexParteLocal = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*$/;
  const regexDominio = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;
  if (!regexParteLocal.test(usuario) || !regexDominio.test(dominio)) {
    return { valido: false, error: "El formato del correo electrónico es inválido." };
  }

  // Evitar nombres de usuario con caracteres sospechosos o repetitivos de bots
  if (usuario.length === 0 || usuario.length > 64) {
    return { valido: false, error: "La parte local del correo electrónico no es válida." };
  }

  // 3. Chequeo de dominios desechables
  if (DISPOSABLE_DOMAINS.has(dominio)) {
    return {
      valido: false,
      error: "No se permiten correos electrónicos temporales o desechables. Utiliza un correo real."
    };
  }

  // Los dominios sintéticos se aceptan exclusivamente en las pruebas
  // automatizadas, nunca al usar la aplicación en desarrollo o producción.
  if (nodeEnv === "test") {
    return { valido: true, email: emailTrim };
  }

  if (isReservedEmailDomain(dominio)) {
    return {
      valido: false,
      error: "Utiliza un dominio de correo público y real.",
    };
  }

  // Verificación DNS fail-closed: ante una falla temporal no se acepta el
  // dominio solo por tener sintaxis válida.
  try {
    if (!(await hasMailRoute(dominio, resolver, timeoutMs))) {
      return {
        valido: false,
        error: `El dominio "@${dominio}" no tiene servidores de correo configurados para recibir mensajes.`,
      };
    }

    return { valido: true, email: emailTrim };
  } catch (err) {
    if (DNS_TEMPORARY_ERROR_CODES.has(err.code)) {
      return {
        valido: false,
        error: "No se pudo comprobar el dominio por un problema temporal de DNS. Inténtalo de nuevo.",
      };
    }

    return {
      valido: false,
      error: `No se pudo verificar la existencia del dominio "@${dominio}".`,
    };
  }
}
