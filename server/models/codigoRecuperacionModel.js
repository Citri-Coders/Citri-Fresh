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

  // Consume el OTP y cambia la contraseña en una única transacción.
  async restablecerPassword({ email, codigo, passwordHash, ahora, intentosMax }) {
    const db = await getDB();
    return db.transaction(async (tx) => {
      const registro = await tx.get(
        "SELECT codigo, expira_en, intentos, verificado FROM codigos_recuperacion WHERE email = ?",
        [email],
      );

      if (!registro) return "invalid";

      if (ahora > Number(registro.expira_en)) {
        await tx.run("DELETE FROM codigos_recuperacion WHERE email = ?", [email]);
        return "invalid";
      }

      if (Number(registro.intentos) >= intentosMax) {
        await tx.run("DELETE FROM codigos_recuperacion WHERE email = ?", [email]);
        return "attempts-exceeded";
      }

      if (Number(registro.verificado) !== 1 || registro.codigo !== codigo) {
        const intentos = Number(registro.intentos) + 1;
        if (intentos >= intentosMax) {
          await tx.run("DELETE FROM codigos_recuperacion WHERE email = ?", [email]);
          return "attempts-exceeded";
        }
        await tx.run(
          "UPDATE codigos_recuperacion SET intentos = ? WHERE email = ?",
          [intentos, email],
        );
        return "invalid";
      }

      const usuario = await tx.get("SELECT id FROM usuarios WHERE email = ?", [email]);
      if (!usuario) {
        await tx.run("DELETE FROM codigos_recuperacion WHERE email = ?", [email]);
        return "invalid";
      }

      await tx.run("UPDATE usuarios SET password_hash = ? WHERE id = ?", [
        passwordHash,
        usuario.id,
      ]);
      await tx.run("DELETE FROM codigos_recuperacion WHERE email = ?", [email]);
      return "success";
    });
  },

  async eliminar(email) {
    const db = await getDB();
    await db.run("DELETE FROM codigos_recuperacion WHERE email = ?", [email]);
  },
};
