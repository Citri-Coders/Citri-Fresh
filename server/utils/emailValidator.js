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

// Dominios estándar verificados que sabemos que siempre tienen registros de correo válidos
const TRUSTED_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "yahoo.com",
  "yahoo.es",
  "icloud.com",
  "proton.me",
  "protonmail.com",
  "zoho.com",
  "citrifresh.com",
  "citrifresh.ni"
]);

/**
 * Valida un correo electrónico en múltiples niveles:
 * 1. Formato sintáctico estricto (RFC 5322 compatible)
 * 2. Longitud y caracteres permitidos
 * 3. Bloqueo de proveedores de correo desechables / bots
 * 4. Verificación DNS en tiempo real de registros MX / A del dominio
 */
export async function validarCorreoReal(email) {
  if (!email || typeof email !== "string") {
    return { valido: false, error: "El correo electrónico es obligatorio." };
  }

  const emailTrim = email.trim().toLowerCase();

  // 1. Longitud
  if (emailTrim.length < 5 || emailTrim.length > 254) {
    return { valido: false, error: "La longitud del correo electrónico no es válida." };
  }

  // 2. Sintaxis estricta
  const regexEstricto = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!regexEstricto.test(emailTrim)) {
    return { valido: false, error: "El formato del correo electrónico es inválido." };
  }

  const parts = emailTrim.split("@");
  if (parts.length !== 2) {
    return { valido: false, error: "Formato de correo no válido." };
  }

  const [usuario, dominio] = parts;

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

  // 4. Si es un dominio de confianza masivo, saltamos DNS para máxima velocidad
  if (TRUSTED_DOMAINS.has(dominio)) {
    return { valido: true, email: emailTrim };
  }

  // 5. Verificación DNS en tiempo real de servidores de correo (Registros MX o A)
  try {
    const mxRecords = await Promise.race([
      dns.resolveMx(dominio),
      new Promise((_, reject) => setTimeout(() => reject(new Error("DNS_TIMEOUT")), 3000))
    ]);

    if (!mxRecords || mxRecords.length === 0) {
      return {
        valido: false,
        error: `El dominio "@${dominio}" no tiene servidores de correo configurados para recibir mensajes.`
      };
    }

    return { valido: true, email: emailTrim };
  } catch (err) {
    // Si no tiene registros MX, intentar verificar si al menos el dominio existe vía registro A
    if (err.code === "ENOTFOUND" || err.code === "NODATA") {
      try {
        const aRecords = await dns.resolve4(dominio);
        if (aRecords && aRecords.length > 0) {
          return { valido: true, email: emailTrim };
        }
      } catch (aErr) {
        return {
          valido: false,
          error: `El dominio de correo "@${dominio}" no existe en internet. Verifica que esté bien escrito.`
        };
      }
      return {
        valido: false,
        error: `El dominio "@${dominio}" no cuenta con servidores de correo válidos.`
      };
    }

    // En caso de timeout o error de red temporal de DNS, permitimos si el dominio tiene estructura TLD válida
    if (err.message === "DNS_TIMEOUT" || err.code === "ECONNREFUSED" || err.code === "ETIMEOUT") {
      console.warn(`[DNS Verification Timeout] Dominio ${dominio} verificado sólo por sintaxis.`);
      return { valido: true, email: emailTrim };
    }

    return {
      valido: false,
      error: `No se pudo verificar la existencia del dominio "@${dominio}".`
    };
  }
}
