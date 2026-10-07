import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { UsuarioModel } from "../models/usuarioModel.js";
import { CodigoRecuperacionModel } from "../models/codigoRecuperacionModel.js";
import { validarCorreoReal } from "../utils/emailValidator.js";
import { enviarCorreoRecuperacion, getUltimoCorreoEnviado } from "../services/emailService.js";
import {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  ADMIN_ACCESS_KEY,
  SALT_ROUNDS,
  COOKIE_OPTIONS,
  CLEAR_COOKIE_OPTIONS,
} from "../config/auth.js";

// COOKIE_OPTIONS y CLEAR_COOKIE_OPTIONS importadas desde config/auth.js

// Cliente de Google Identity Services para verificación criptográfica real de tokens
let googleOAuthClient = null;
const getGoogleOAuthClient = () => {
  if (!process.env.GOOGLE_CLIENT_ID) return null;
  if (!googleOAuthClient) {
    googleOAuthClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }
  return googleOAuthClient;
};

export const register = async (req, res) => {
  try {
    const {
      nombre,
      email,
      password,
      rol,
      admin_key,
      telefono,
      direccion,
      foto,
      nombre_finca,
      zona_cultivo,
      capacidad_produccion,
      tipos_citricos
    } = req.body;

    // Regla de seguridad para creación de Administradores y Auditores: Solo con Clave Maestra Única
    if (rol === "admin" || rol === "auditor") {
      if (!admin_key || admin_key.trim() !== ADMIN_ACCESS_KEY) {
        return res.status(403).json({
          error: "Clave Maestra de Autorización inválida o ausente. Acceso restringido.",
        });
      }
    }

    const existe = await UsuarioModel.existsByEmail(email);
    if (existe) {
      return res
        .status(409)
        .json({ error: "El correo electrónico ya está registrado" });
    }

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    const nuevoUsuario = await UsuarioModel.create({
      nombre,
      email,
      password_hash,
      rol: rol || "cliente",
      telefono: telefono || "",
      direccion: direccion || "",
      foto: foto || "",
      nombre_finca: nombre_finca || "",
      zona_cultivo: zona_cultivo || "",
      capacidad_produccion: capacidad_produccion || "",
      tipos_citricos: tipos_citricos || ""
    });

    const token = jwt.sign(
      { id: nuevoUsuario.id, rol: nuevoUsuario.rol },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    res.cookie("token", token, COOKIE_OPTIONS);

    return res.status(201).json({
      message: "Usuario registrado exitosamente",
      user: nuevoUsuario,
    });
  } catch (error) {
    console.error("Error en register:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await UsuarioModel.findByEmail(email);
    if (!usuario) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const esValida = await bcrypt.compare(password, usuario.password_hash);
    if (!esValida) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.cookie("token", token, COOKIE_OPTIONS);

    return res.status(200).json({
      message: "Inicio de sesión exitoso",
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ 
      error: "Error interno del servidor"
    });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", CLEAR_COOKIE_OPTIONS);
  return res.status(200).json({ message: "Sesión cerrada exitosamente" });
};

export const getMe = async (req, res) => {
  try {
    const usuario = await UsuarioModel.findById(req.user.id);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    return res.status(200).json({ user: usuario });
  } catch (error) {
    console.error("Error en getMe:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const actualizarPerfil = async (req, res) => {
  try {
    const { nombre, email, password_actual, password_nuevo, foto, telefono, direccion } = req.body;
    const usuarioId = req.user.id;

    const usuarioActual = await UsuarioModel.findByIdWithPassword(usuarioId);
    if (!usuarioActual) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // 1. Si cambia el email, verificar que no esté ocupado por otro usuario
    const nuevoEmail = email ? email.trim().toLowerCase() : usuarioActual.email;
    if (nuevoEmail !== usuarioActual.email) {
      const emailEnUso = await UsuarioModel.existsByEmail(nuevoEmail);
      if (emailEnUso && emailEnUso.id !== usuarioId) {
        return res
          .status(409)
          .json({ error: "El correo electrónico ya está en uso por otra cuenta" });
      }
    }

    // 2. Si cambia la contraseña, verificar la contraseña actual
    let nuevoPasswordHash = null;
    if (password_nuevo) {
      const passwordValido = await bcrypt.compare(
        password_actual,
        usuarioActual.password_hash,
      );

      if (!passwordValido) {
        return res
          .status(400)
          .json({ error: "La contraseña actual es incorrecta" });
      }

      nuevoPasswordHash = await bcrypt.hash(password_nuevo, SALT_ROUNDS);
    }

    // 3. Actualizar datos en la base de datos
    const usuarioActualizado = await UsuarioModel.update(usuarioId, {
      nombre: nombre !== undefined ? nombre.trim() : usuarioActual.nombre,
      email: nuevoEmail,
      password_hash: nuevoPasswordHash,
      foto: foto !== undefined ? foto : usuarioActual.foto,
      telefono: telefono !== undefined ? telefono.trim() : usuarioActual.telefono,
      direccion: direccion !== undefined ? direccion.trim() : usuarioActual.direccion,
    });

    return res.status(200).json({
      message: "Perfil actualizado exitosamente",
      user: usuarioActualizado,
    });
  } catch (error) {
    console.error("Error en actualizarPerfil:", error);
    return res
      .status(500)
      .json({ error: "Error interno al actualizar el perfil" });
  }
};

// Autenticación con Google (login o registro transparente con datos reales de Google)
export const googleAuth = async (req, res) => {
  try {
    let { nombre, email, rol, foto, credential } = req.body;

    // 1. Si viene un token JWT 'credential' emitido por Google Identity Services (GSI)
    if (credential) {
      const client = getGoogleOAuthClient();
      if (!client) {
        return res.status(500).json({
          error: "La autenticación con Google no está configurada (falta GOOGLE_CLIENT_ID)",
        });
      }
      try {
        // Verificación criptográfica real de la firma del token de Google
        const ticket = await client.verifyIdToken({
          idToken: credential,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
        const googleData = ticket.getPayload();

        if (!googleData || !googleData.email) {
          return res.status(401).json({ error: "El token de Google no contiene un correo válido" });
        }
        if (googleData.email_verified === false) {
          return res.status(401).json({ error: "El correo de Google no está verificado" });
        }

        email = googleData.email;
        nombre = googleData.name || nombre;
        foto = googleData.picture || foto;
      } catch (tokenErr) {
        console.warn("Token de Google inválido:", tokenErr.message);
        return res.status(401).json({ error: "El token de Google no es válido o ha expirado" });
      }
    }

    if (!email) {
      return res.status(400).json({ error: "El correo de Google es obligatorio" });
    }

    // Validación estricta y real del correo
    const verificacion = await validarCorreoReal(email);
    if (!verificacion.valido) {
      return res.status(400).json({ error: verificacion.error });
    }

    const emailNorm = verificacion.email;
    let usuario = await UsuarioModel.findByEmail(emailNorm);

    if (!usuario) {
      // Registrar automáticamente con contraseña aleatoria segura y foto de Google si existe
      const dummyPassword = Math.random().toString(36).slice(-10) + "Aa1!";
      const password_hash = await bcrypt.hash(dummyPassword, SALT_ROUNDS);

      usuario = await UsuarioModel.create({
        nombre: nombre ? nombre.trim() : "Usuario Google",
        email: emailNorm,
        password_hash,
        rol: rol && ["cliente", "productor"].includes(rol) ? rol : "cliente",
        foto: foto || "",
      });
    } else if (foto && !usuario.foto) {
      // Si el usuario ya existía pero no tenía foto, le asignamos la foto de Google
      await UsuarioModel.update(usuario.id, { foto });
      usuario.foto = foto;
    }

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    res.cookie("token", token, COOKIE_OPTIONS);

    return res.status(200).json({
      message: "Autenticación con Google exitosa",
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        foto: usuario.foto || foto || "",
      },
    });
  } catch (error) {
    console.error("Error en googleAuth:", error);
    return res.status(500).json({ error: "Error interno al procesar inicio con Google" });
  }
};

// Listar todos los usuarios para el Admin
export const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await UsuarioModel.obtenerTodos();
    return res.status(200).json(usuarios);
  } catch (error) {
    console.error("Error al listar usuarios:", error);
    return res.status(500).json({ error: "Error interno al obtener usuarios" });
  }
};

// Eliminar usuario desde el Admin
export const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    if (Number(id) === req.user.id) {
      return res.status(400).json({ error: "No puedes eliminar tu propia cuenta de administrador" });
    }

    const usuarioExistente = await UsuarioModel.findById(id);
    if (!usuarioExistente) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const result = await UsuarioModel.eliminar(id);
    return res.status(200).json({
      message: "Usuario eliminado exitosamente",
      cambios: result.cambios,
    });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    return res.status(500).json({ error: "Error interno al eliminar usuario" });
  }
};

// Recuperar Contraseña - Generar y enviar código de seguridad al correo
export const recuperarPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "El correo electrónico es obligatorio" });
    }

    const emailNorm = email.trim().toLowerCase();
    const usuario = await UsuarioModel.findByEmail(emailNorm);
    if (!usuario) {
      return res.status(404).json({ error: "No existe ninguna cuenta registrada con este correo electrónico" });
    }

    // Generar un código criptográfico / aleatorio de seguridad de 6 dígitos
    const codigo = crypto.randomInt(100000, 999999).toString();
    const expiraEn = Date.now() + 15 * 60 * 1000; // 15 minutos de validez

    // Persistir el OTP en la base de datos (Turso/SQLite) para que sobreviva
    // entre instancias serverless en producción
    await CodigoRecuperacionModel.guardar(emailNorm, codigo, expiraEn);

    // Despachar correo electrónico real vía Nodemailer (SMTP o Ethereal con previsualización)
    const resultadoEnvio = await enviarCorreoRecuperacion({
      email: emailNorm,
      nombre: usuario.nombre,
      codigo
    });

    console.log(`[Citri-Fresh Seguridad - Enlace/Correo Enviado] Código para ${emailNorm}: [${codigo}]. Preview: ${resultadoEnvio.previewUrl || 'Buzón Local'}`);

    return res.status(200).json({
      message: `Hemos enviado un código de verificación de 6 dígitos a tu correo ${emailNorm}. Revisa tu bandeja de entrada o carpeta de spam.`,
      email: emailNorm,
      nombre: usuario.nombre,
      previewUrl: resultadoEnvio.previewUrl || null
    });
  } catch (error) {
    console.error("Error en recuperarPassword:", error);
    return res.status(500).json({ error: "Error interno al procesar recuperación de contraseña" });
  }
};

// Endpoint para obtener el último correo enviado (útil para pruebas inmediatas en pantalla si el usuario no tiene correo real de prueba)
export const obtenerUltimoCorreo = (req, res) => {
  const ultimo = getUltimoCorreoEnviado();
  if (!ultimo) {
    return res.status(404).json({ error: "No hay correos enviados recientemente" });
  }
  return res.status(200).json(ultimo);
};

// Validar código OTP de 6 dígitos
export const verificarCodigoRecuperacion = async (req, res) => {
  try {
    const { email, codigo } = req.body;
    if (!email || !codigo) {
      return res.status(400).json({ error: "El correo y el código de seguridad son requeridos" });
    }

    const emailNorm = email.trim().toLowerCase();
    const registro = await CodigoRecuperacionModel.obtener(emailNorm);

    if (!registro) {
      return res.status(400).json({ error: "No hay una solicitud de recuperación activa o el código ha expirado. Solicita uno nuevo." });
    }

    if (Date.now() > Number(registro.expira_en)) {
      await CodigoRecuperacionModel.eliminar(emailNorm);
      return res.status(400).json({ error: "El código ha expirado por seguridad (límite 15 minutos). Solicita uno nuevo." });
    }

    if (registro.codigo !== codigo.trim()) {
      await CodigoRecuperacionModel.incrementarIntentos(emailNorm);
      const intentos = Number(registro.intentos) + 1;
      if (intentos >= 5) {
        await CodigoRecuperacionModel.eliminar(emailNorm);
        return res.status(429).json({ error: "Has excedido el número máximo de intentos. Solicita un nuevo código." });
      }
      return res.status(400).json({ error: `Código de seguridad incorrecto. Intento ${intentos} de 5.` });
    }

    await CodigoRecuperacionModel.marcarVerificado(emailNorm);

    return res.status(200).json({
      message: "Código de seguridad validado con éxito. Ya puedes establecer tu nueva contraseña.",
      valido: true
    });
  } catch (error) {
    console.error("Error en verificarCodigoRecuperacion:", error);
    return res.status(500).json({ error: "Error interno al validar el código" });
  }
};

// Restablecer contraseña con nueva clave (exige validación previa del código de seguridad)
export const restablecerPassword = async (req, res) => {
  try {
    const { email, codigo, password_nuevo } = req.body;
    if (!email || !password_nuevo) {
      return res.status(400).json({ error: "El correo y la nueva contraseña son obligatorios" });
    }

    if (password_nuevo.length < 6) {
      return res.status(400).json({ error: "La nueva contraseña debe tener al menos 6 caracteres" });
    }

    const emailNorm = email.trim().toLowerCase();
    const registro = await CodigoRecuperacionModel.obtener(emailNorm);

    // Verificar que haya superado el código de seguridad
    if (!registro || (Number(registro.verificado) !== 1 && registro.codigo !== codigo?.trim())) {
      return res.status(403).json({ error: "Operación no autorizada. Debes validar tu código de seguridad primero." });
    }

    if (Date.now() > Number(registro.expira_en)) {
      await CodigoRecuperacionModel.eliminar(emailNorm);
      return res.status(403).json({ error: "El código ha expirado por seguridad. Solicita uno nuevo." });
    }

    const usuario = await UsuarioModel.findByEmail(emailNorm);
    if (!usuario) {
      return res.status(404).json({ error: "No existe ninguna cuenta con ese correo electrónico" });
    }

    const nuevoPasswordHash = await bcrypt.hash(password_nuevo, SALT_ROUNDS);
    await UsuarioModel.update(usuario.id, { password_hash: nuevoPasswordHash });

    // Invalidar el código de seguridad tras su uso exitoso
    await CodigoRecuperacionModel.eliminar(emailNorm);

    return res.status(200).json({
      message: "Tu contraseña ha sido restablecida exitosamente. Ya puedes iniciar sesión de forma segura."
    });
  } catch (error) {
    console.error("Error en restablecerPassword:", error);
    return res.status(500).json({ error: "Error interno al restablecer la contraseña" });
  }
};
