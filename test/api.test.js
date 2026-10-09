import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

// Aislar la BD de pruebas: se usa un archivo temporal y nunca Turso.
const tmpDb = path.join(os.tmpdir(), `citrifresh-test-${Date.now()}.db`);
process.env.NODE_ENV = "test";
process.env.TURSO_DATABASE_URL = "";
process.env.TURSO_AUTH_TOKEN = "";
process.env.DB_PATH = tmpDb;
process.env.JWT_SECRET = "test-secret-key-exclusiva-para-tests";
process.env.GOOGLE_CLIENT_ID = "";
process.env.SMTP_HOST = "";
process.env.SMTP_USER = "";
process.env.SMTP_PASS = "";
process.env.RATE_LIMIT_MAX_REQUESTS = "1000";
process.env.RATE_LIMIT_LOGIN_MAX_REQUESTS = "1000";
process.env.LOG_LEVEL = "silent";

const { default: app } = await import("../server/app.js");
const { getDB } = await import("../server/config/db.js");
const { default: bcrypt } = await import("bcryptjs");
const { validarCorreoReal } = await import("../server/utils/emailValidator.js");

let server;
let baseUrl;
let adminCookie = "";

const postJson = (ruta, body, headers = {}) =>
  fetch(`${baseUrl}${ruta}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;

  const loginRes = await postJson("/api/auth/login", {
    email: "admin@citrifresh.com",
    password: "admin123",
  });
  const rawCookies = loginRes.headers.getSetCookie
    ? loginRes.headers.getSetCookie()
    : [loginRes.headers.get("set-cookie")];
  adminCookie = rawCookies.map((c) => c.split(";")[0]).join("; ");
});

after(() => {
  if (server) server.close();
  for (const suffix of ["", "-wal", "-shm"]) {
    try {
      fs.unlinkSync(tmpDb + suffix);
    } catch {
      // ignorar si no existe
    }
  }
});

test("GET /api/auth/config responde 200 con googleClientId", async () => {
  const res = await fetch(`${baseUrl}/api/auth/config`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.ok(
    Object.prototype.hasOwnProperty.call(body.data, "googleClientId"),
  );
});

test("GET /api/auth/me sin sesión responde 401 con error estandarizado", async () => {
  const res = await fetch(`${baseUrl}/api/auth/me`);
  assert.equal(res.status, 401);
  const body = await res.json();
  assert.equal(body.success, false);
  assert.ok(typeof body.error === "string");
});

test("POST /api/auth/register sin campos responde 400", async () => {
  const res = await postJson("/api/auth/register", { email: "x@y.com" });
  assert.equal(res.status, 400);
  const body = await res.json();
  assert.equal(body.success, false);
});

test("POST /api/auth/register con nombre demasiado largo responde 400 (H18)", async () => {
  const res = await postJson("/api/auth/register", {
    nombre: "a".repeat(101),
    email: "largonombre@example.com",
    password: "secreto123",
  });
  assert.equal(res.status, 400);
});

test("POST /api/auth/login con credenciales inválidas responde 401", async () => {
  const res = await postJson("/api/auth/login", {
    email: "admin@citrifresh.com",
    password: "clave_incorrecta",
  });
  assert.equal(res.status, 401);
});

test("POST /api/auth/login con admin válido responde 200 y entrega cookie", async () => {
  assert.ok(adminCookie.includes("token="));
});

test("POST /api/auth/logout expira la cookie y redirige al inicio", async () => {
  const res = await fetch(`${baseUrl}/api/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: adminCookie },
    body: "{}",
    redirect: "manual",
  });
  const setCookie = res.headers.get("set-cookie") || "";

  assert.equal(res.status, 303);
  assert.equal(res.headers.get("location"), "/pages/inicio.html");
  assert.match(setCookie, /token=;/i);
  assert.match(setCookie, /path=\//i);
  assert.match(setCookie, /expires=thu, 01 jan 1970/i);
});

test("POST /api/auth/logout redirige aunque no venga como formulario", async () => {
  const res = await fetch(`${baseUrl}/api/auth/logout`, {
    method: "POST",
    headers: { Cookie: adminCookie },
    redirect: "manual",
  });

  assert.equal(res.status, 303);
  assert.equal(res.headers.get("location"), "/pages/inicio.html");
  assert.match(res.headers.get("set-cookie") || "", /token=;/i);
});

test("logout desde formulario redirige al inicio y no depende de JavaScript", async () => {
  const res = await fetch(`${baseUrl}/api/auth/logout`, {
    method: "POST",
    headers: {
      Cookie: adminCookie,
      "Content-Type": "application/x-www-form-urlencoded",
      Origin: "null",
    },
    body: "",
    redirect: "manual",
  });

  assert.equal(res.status, 303);
  assert.equal(res.headers.get("location"), "/pages/inicio.html");
  assert.match(res.headers.get("set-cookie") || "", /token=;/i);
  assert.equal(res.headers.get("access-control-allow-origin"), null);
});

test("un origen CORS no permitido recibe 403 en lugar de error interno", async () => {
  const res = await fetch(`${baseUrl}/api/auth/config`, {
    headers: { Origin: "https://outside.example" },
  });

  assert.equal(res.status, 403);
  assert.equal(res.headers.get("access-control-allow-origin"), null);
  assert.equal((await res.json()).error, "Origen no permitido por CORS");
});

test("POST /api/auth/google rechaza perfiles sin credencial firmada", async () => {
  const res = await postJson("/api/auth/google", {
    email: "admin@citrifresh.com",
    nombre: "Suplantación",
  });

  assert.equal(res.status, 401);
  assert.equal(res.headers.get("set-cookie"), null);
});

test("POST /api/auth/register no permite autorregistro privilegiado", async () => {
  const res = await postJson("/api/auth/register", {
    nombre: "Administrador falso",
    email: "admin-falso@example.com",
    password: "Segura123",
    rol: "admin",
    admin_key: "test-admin-key",
  });

  assert.equal(res.status, 400);
});

test("la validación de correo exige un dominio con ruta de correo fuera de tests", async () => {
  const mxResolver = {
    resolveMx: async () => [{ exchange: "mx.routable.dev", priority: 10 }],
    resolve4: async () => [],
    resolve6: async () => [],
  };
  const noRecords = Object.assign(new Error("No hay registros"), {
    code: "ENODATA",
  });
  const noMailResolver = {
    resolveMx: async () => [],
    resolve4: async () => Promise.reject(noRecords),
    resolve6: async () => Promise.reject(noRecords),
  };
  const nullMxResolver = {
    resolveMx: async () => [{ exchange: ".", priority: 0 }],
    resolve4: async () => {
      throw new Error("No debe usarse fallback A para Null MX");
    },
    resolve6: async () => [],
  };
  const implicitMxResolver = {
    resolveMx: async () => Promise.reject(noRecords),
    resolve4: async () => ["203.0.113.10"],
    resolve6: async () => Promise.reject(noRecords),
  };
  const temporaryDnsFailureResolver = {
    resolveMx: async () =>
      Promise.reject(Object.assign(new Error("DNS temporal"), { code: "EAI_AGAIN" })),
    resolve4: async () => [],
    resolve6: async () => [],
  };

  const valid = await validarCorreoReal("Comprador@routable.dev", {
    nodeEnv: "development",
    resolver: mxResolver,
  });
  const noMail = await validarCorreoReal("comprador@no-mail.dev", {
    nodeEnv: "production",
    resolver: noMailResolver,
  });
  const nullMx = await validarCorreoReal("comprador@null-mx.dev", {
    nodeEnv: "production",
    resolver: nullMxResolver,
  });
  const implicitMx = await validarCorreoReal("comprador@implicit-mx.dev", {
    nodeEnv: "production",
    resolver: implicitMxResolver,
  });
  const temporaryDnsFailure = await validarCorreoReal("comprador@temporary.dev", {
    nodeEnv: "production",
    resolver: temporaryDnsFailureResolver,
  });
  const placeholder = await validarCorreoReal("comprador@example.com", {
    nodeEnv: "production",
    resolver: mxResolver,
  });
  const syntheticTest = await validarCorreoReal("comprador@example.com", {
    nodeEnv: "test",
    resolver: noMailResolver,
  });
  const malformedDot = await validarCorreoReal(".comprador@routable.dev", {
    nodeEnv: "development",
    resolver: mxResolver,
  });
  const consecutiveDots = await validarCorreoReal("comprador..uno@routable.dev", {
    nodeEnv: "development",
    resolver: mxResolver,
  });

  assert.deepEqual(valid, { valido: true, email: "comprador@routable.dev" });
  assert.equal(noMail.valido, false);
  assert.equal(nullMx.valido, false);
  assert.equal(implicitMx.valido, true);
  assert.equal(temporaryDnsFailure.valido, false);
  assert.equal(placeholder.valido, false);
  assert.equal(syntheticTest.valido, true);
  assert.equal(malformedDot.valido, false);
  assert.equal(consecutiveDots.valido, false);
});

test("recuperación responde igual para correos existentes e inexistentes", async () => {
  const registrado = await postJson("/api/auth/recuperar-password", {
    email: "admin@citrifresh.com",
  });
  const desconocido = await postJson("/api/auth/recuperar-password", {
    email: "nadie@example.com",
  });

  assert.equal(registrado.status, 202);
  assert.equal(desconocido.status, 202);
  assert.deepEqual(await registrado.json(), await desconocido.json());
});

test("restablecer contraseña exige OTP incluso tras verificarlo y lo consume una vez", async () => {
  const db = await getDB();
  const admin = await db.get(
    "SELECT password_hash FROM usuarios WHERE email = ?",
    ["admin@citrifresh.com"],
  );

  try {
    await db.run(
      `INSERT INTO codigos_recuperacion (email, codigo, expira_en, intentos, verificado)
       VALUES (?, ?, ?, 0, 1)
       ON CONFLICT(email) DO UPDATE SET
         codigo = excluded.codigo,
         expira_en = excluded.expira_en,
         intentos = 0,
         verificado = 1`,
      ["admin@citrifresh.com", "123456", Date.now() + 60_000],
    );

    const sinCodigo = await postJson("/api/auth/restablecer-password", {
      email: "admin@citrifresh.com",
      password_nuevo: "CambioSeguro123",
    });
    assert.equal(sinCodigo.status, 400);

    const codigoIncorrecto = await postJson("/api/auth/restablecer-password", {
      email: "admin@citrifresh.com",
      codigo: "000000",
      password_nuevo: "CambioSeguro123",
    });
    assert.equal(codigoIncorrecto.status, 403);

    const conCodigo = await postJson("/api/auth/restablecer-password", {
      email: "admin@citrifresh.com",
      codigo: "123456",
      password_nuevo: "CambioSeguro123",
    });
    assert.equal(conCodigo.status, 200);

    const nuevoHash = await db.get(
      "SELECT password_hash FROM usuarios WHERE email = ?",
      ["admin@citrifresh.com"],
    );
    assert.equal(await bcrypt.compare("CambioSeguro123", nuevoHash.password_hash), true);
    assert.equal(
      await db.get("SELECT email FROM codigos_recuperacion WHERE email = ?", [
        "admin@citrifresh.com",
      ]),
      undefined,
    );
  } finally {
    await db.run(
      "UPDATE usuarios SET password_hash = ? WHERE email = ?",
      [admin.password_hash, "admin@citrifresh.com"],
    );
    await db.run("DELETE FROM codigos_recuperacion WHERE email = ?", [
      "admin@citrifresh.com",
    ]);
  }
});

test("GET /api/auth/me con sesión válida responde 200", async () => {
  const res = await fetch(`${baseUrl}/api/auth/me`, {
    headers: { Cookie: adminCookie },
  });
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.equal(body.data.email, "admin@citrifresh.com");
});

test("JWT no conserva privilegios después de cambiar el rol en la base de datos", async () => {
  const db = await getDB();
  await db.run("UPDATE usuarios SET rol = 'cliente' WHERE email = ?", [
    "admin@citrifresh.com",
  ]);

  try {
    const res = await fetch(`${baseUrl}/api/auth/usuarios`, {
      headers: { Cookie: adminCookie },
    });
    assert.equal(res.status, 403);
  } finally {
    await db.run("UPDATE usuarios SET rol = 'admin' WHERE email = ?", [
      "admin@citrifresh.com",
    ]);
  }
});

test("DELETE /api/auth/usuarios/:id inexistente responde 404 (H11)", async () => {
  const res = await fetch(`${baseUrl}/api/auth/usuarios/999999`, {
    method: "DELETE",
    headers: { Cookie: adminCookie },
  });
  assert.equal(res.status, 404);
});

export {};
