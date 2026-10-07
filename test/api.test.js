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
process.env.ADMIN_ACCESS_KEY = "test-admin-key";
process.env.GOOGLE_CLIENT_ID = "";
process.env.RATE_LIMIT_MAX_REQUESTS = "1000";
process.env.RATE_LIMIT_LOGIN_MAX_REQUESTS = "1000";
process.env.LOG_LEVEL = "silent";

const { default: app } = await import("../server/app.js");

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
  assert.ok(Object.prototype.hasOwnProperty.call(body, "googleClientId"));
});

test("GET /api/auth/me sin sesión responde 401", async () => {
  const res = await fetch(`${baseUrl}/api/auth/me`);
  assert.equal(res.status, 401);
});

test("POST /api/auth/register sin campos responde 400", async () => {
  const res = await postJson("/api/auth/register", { email: "x@y.com" });
  assert.equal(res.status, 400);
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

test("GET /api/auth/me con sesión válida responde 200", async () => {
  const res = await fetch(`${baseUrl}/api/auth/me`, {
    headers: { Cookie: adminCookie },
  });
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.user.email, "admin@citrifresh.com");
});

test("DELETE /api/auth/usuarios/:id inexistente responde 404 (H11)", async () => {
  const res = await fetch(`${baseUrl}/api/auth/usuarios/999999`, {
    method: "DELETE",
    headers: { Cookie: adminCookie },
  });
  assert.equal(res.status, 404);
});

export {};
