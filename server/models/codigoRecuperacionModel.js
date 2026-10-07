import { getDB } from "../config/db.js";

export const CodigoRecuperacionModel = {
  async guardar(email, codigo, expiraEn) {
    const db = await getDB();
    await db.run(
      `INSERT INTO codigos_recuperacion (email, codigo, expira_en, intentos, verificado)
       VALUES (?, ?, ?, 0, 0)
       ON CONFLICT(email) DO UPDATE SET
         codigo = excluded.codigo,
         expira_en = excluded.expira_en,
         intentos = 0,
         verificado = 0`,
      [email, codigo, expiraEn],
    );
  },

  async obtener(email) {
    const db = await getDB();
    return db.get("SELECT * FROM codigos_recuperacion WHERE email = ?", [email]);
  },

  async incrementarIntentos(email) {
    const db = await getDB();
    await db.run(
      "UPDATE codigos_recuperacion SET intentos = intentos + 1 WHERE email = ?",
      [email],
    );
  },

  async marcarVerificado(email) {
    const db = await getDB();
    await db.run(
      "UPDATE codigos_recuperacion SET verificado = 1 WHERE email = ?",
      [email],
    );
  },

  async eliminar(email) {
    const db = await getDB();
    await db.run("DELETE FROM codigos_recuperacion WHERE email = ?", [email]);
  },
};
