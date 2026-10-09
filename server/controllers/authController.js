import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { UsuarioModel } from "../models/usuarioModel.js";
import { CodigoRecuperacionModel } from "../models/codigoRecuperacionModel.js";
import { enviarCorreoRecuperacion, getUltimoCorreoEnviado } from "../services/emailService.js";
import {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  SALT_ROUNDS,
  COOKIE_OPTIONS,
  CLEAR_COOKIE_OPTIONS,
} from "../config/auth.js";
import {
  ROLES,
  ROLES_AUTO_REGISTRO,
  NOMBRE_COOKIE_TOKEN,
  OTP_INTENTOS_MAX,
  OTP_VIGENCIA_MS,
} from "../config/constants.js";
import {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  TooManyRequestsError,
} from "../utils/appError.js";
import { sendSuccess } from "../utils/apiResponse.js";
import logger from "../config/logger.js";

// Cliente de Google Identity Services para verificación criptográfica real de tokens
let googleOAuthClient = null;
const getGoogleOAuthClient = () => {
  if (!process.env.GOOGLE_CLIENT_ID) return null;
  if (!googleOAuthClient) {
    googleOAuthClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }
  return googleOAuthClient;
};

const emitirToken = (res, { id, rol }) => {
  const token = jwt.sign({ id, rol }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  res.cookie(NOMBRE_COOKIE_TOKEN, token, COOKIE_OPTIONS);
};

export const register = async (req, res, next) => {
  try {
    const {
      nombre,
      email,
      password,
      rol,
      telefono,
      direccion,
      foto,
      nombre_finca,
      zona_cultivo,
      capacidad_produccion,
      tipos_citricos,
    } = req.body;

    // El endpoint de registro es público: solo admite roles de autorregistro.
    // Las cuentas privilegiadas deben aprovisionarse por un canal administrativo.
    if (rol && !ROLES_AUTO_REGISTRO.includes(rol)) {
      throw new ForbiddenError(
        "El registro público no permite crear cuentas administrativas o de auditoría.",
      );
    }

    const existe = await UsuarioModel.existsByEmail(email);
    if (existe) {
      throw new ConflictError("El correo electrónico ya está registrado");
    }

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    const nuevoUsuario = await UsuarioModel.create({
      nombre,
      email,
      password_hash,
      rol: rol || ROLES.CLIENTE,
      telefono: telefono || "",
      direccion: direccion || "",
      foto: foto || "",
      nombre_finca: nombre_finca || "",
      zona_cultivo: zona_cultivo || "",
      capacidad_produccion: capacidad_produccion || "",
      tipos_citricos: tipos_citricos || "",
    });

    emitirToken(res, nuevoUsuario);

    return sendSuccess(res, nuevoUsuario, {
      status: 201,
      message: "Usuario registrado exitosamente",
    });
  } catch (error) {
    return next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const usuario = await UsuarioModel.findByEmail(email);
    if (!usuario) {
      throw new UnauthorizedError("Credenciales inválidas");
    }

    const esValida = await bcrypt.compare(password, usuario.password_hash);
    if (!esValida) {
      throw new UnauthorizedError("Credenciales inválidas");
    }

    const usuarioPublico = {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
    };

    emitirToken(res, usuarioPublico);

    return sendSuccess(res, usuarioPublico, {
      message: "Inicio de sesión exitoso",
    });
  } catch (error) {
    return next(error);
  }
};

export const logout = (req, res) => {
  res.clearCookie(NOMBRE_COOKIE_TOKEN, CLEAR_COOKIE_OPTIONS);
  return res.redirect(303, "/pages/inicio.html");
};

export const getMe = async (req, res, next) => {
  try {
    const usuario = await UsuarioModel.findById(req.user.id);
    if (!usuario) {
      throw new NotFoundError("Usuario no encontrado");
    }
    return sendSuccess(res, usuario);
  } catch (error) {
    return next(error);
  }
};

export const actualizarPerfil = async (req, res, next) => {
  try {
    const { nombre, email, password_actual, password_nuevo, foto, telefono, direccion } =
      req.body;
    const usuarioId = req.user.id;

    const usuarioActual = await UsuarioModel.findByIdWithPassword(usuarioId);
    if (!usuarioActual) {
      throw new NotFoundError("Usuario no encontrado");
    }

    // 1. Si cambia el email, verificar que no esté ocupado por otro usuario
    const nuevoEmail = email ? email.trim().toLowerCase() : usuarioActual.email;
    if (nuevoEmail !== usuarioActual.email) {
      const emailEnUso = await UsuarioModel.existsByEmail(nuevoEmail);
      if (emailEnUso && emailEnUso.id !== usuarioId) {
        throw new ConflictError(
          "El correo electrónico ya está en uso por otra cuenta",
        );
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
        throw new BadRequestError("La contraseña actual es incorrecta");
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

    return sendSuccess(res, usuarioActualizado, {
      message: "Perfil actualizado exitosamente",
    });
  } catch (error) {
    return next(error);
  }
};

// Autenticación con Google (login o registro transparente con datos reales de Google)
export const googleAuth = async (req, res, next) => {
  try {
    const { credential, rol } = req.body;
    if (typeof credential !== "string" || credential.length === 0) {
      throw new UnauthorizedError("Se requiere una credencial válida de Google");
    }

    const client = getGoogleOAuthClient();
    if (!client) {
      throw new AppError(
        "La autenticación con Google no está configurada (falta GOOGLE_CLIENT_ID)",
        500,
      );
    }

    let googleData;
    try {
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      googleData = ticket.getPayload();
    } catch (tokenErr) {
      logger.warn({ err: tokenErr }, "Token de Google inválido");
      throw new UnauthorizedError("El token de Google no es válido o ha expirado");
    }

    if (!googleData?.email || googleData.email_verified !== true) {
      throw new UnauthorizedError("Google no verificó el correo de esta cuenta");
    }

    const emailNorm = googleData.email.trim().toLowerCase();
    let usuario = await UsuarioModel.findByEmail(emailNorm);

    if (!usuario) {
      const dummyPassword = `${crypto.randomBytes(32).toString("base64url")}Aa1!`;
      const password_hash = await bcrypt.hash(dummyPassword, SALT_ROUNDS);

      usuario = await UsuarioModel.create({
        nombre: googleData.name || "Usuario Google",
        email: emailNorm,
        password_hash,
        rol: ROLES_AUTO_REGISTRO.includes(rol) ? rol : ROLES.CLIENTE,
        foto: googleData.picture || "",
      });
    } else if (googleData.picture && !usuario.foto) {
      await UsuarioModel.update(usuario.id, { foto: googleData.picture });
      usuario.foto = googleData.picture;
    }

    const usuarioPublico = {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      foto: usuario.foto || googleData.picture || "",
    };

    emitirToken(res, usuarioPublico);

    return sendSuccess(res, usuarioPublico, {
      message: "Autenticación con Google exitosa",
    });
  } catch (error) {
    return next(error);
  }
};

// Listar todos los usuarios para el Admin
export const listarUsuarios = async (req, res, next) => {
  try {
    const usuarios = await UsuarioModel.obtenerTodos();
    return sendSuccess(res, usuarios);
  } catch (error) {
    return next(error);
  }
};

// Eliminar usuario desde el Admin
export const eliminarUsuario = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (Number(id) === req.user.id) {
      throw new BadRequestError(
        "No puedes eliminar tu propia cuenta de administrador",
      );
    }

    const usuarioExistente = await UsuarioModel.findById(id);
    if (!usuarioExistente) {
      throw new NotFoundError("Usuario no encontrado");
    }

    const result = await UsuarioModel.eliminar(id);
    return sendSuccess(res, { cambios: result.cambios }, {
      message: "Usuario eliminado exitosamente",
    });
  } catch (error) {
    return next(error);
  }
};

// Recuperar Contraseña - Generar y enviar código de seguridad al correo
export const recuperarPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (typeof email !== "string" || !email.trim()) {
      throw new BadRequestError("El correo electrónico es obligatorio");
    }

    const emailNorm = email.trim().toLowerCase();
    const usuario = await UsuarioModel.findByEmail(emailNorm);

    if (usuario) {
      const codigo = crypto.randomInt(100000, 999999).toString();
      const expiraEn = Date.now() + OTP_VIGENCIA_MS;

      await CodigoRecuperacionModel.guardar(emailNorm, codigo, expiraEn);
      await enviarCorreoRecuperacion({
        email: emailNorm,
        nombre: usuario.nombre,
        codigo,
      });

      logger.info("Solicitud de recuperación procesada");
    }

    // Respuesta indistinguible para evitar enumerar cuentas registradas.
    return sendSuccess(res, null, {
      status: 202,
      message:
        "Si el correo corresponde a una cuenta, recibirás instrucciones para recuperar el acceso.",
    });
  } catch (error) {
    return next(error);
  }
};

// Endpoint para obtener el último correo enviado (utilidad de pruebas para admin/auditor)
export const obtenerUltimoCorreo = (req, res, next) => {
  const ultimo = getUltimoCorreoEnviado();
  if (!ultimo) {
    return next(new NotFoundError("No hay correos enviados recientemente"));
  }
  return sendSuccess(res, ultimo);
};

// Validar código OTP de 6 dígitos
export const verificarCodigoRecuperacion = async (req, res, next) => {
  try {
    const { email, codigo } = req.body;
    if (typeof email !== "string" || typeof codigo !== "string" || !email.trim()) {
      throw new BadRequestError(
        "El correo y el código de seguridad son requeridos",
      );
    }

    const emailNorm = email.trim().toLowerCase();
    const registro = await CodigoRecuperacionModel.obtener(emailNorm);

    if (!registro) {
      throw new BadRequestError(
        "No hay una solicitud de recuperación activa o el código ha expirado. Solicita uno nuevo.",
      );
    }

    if (Date.now() > Number(registro.expira_en)) {
      await CodigoRecuperacionModel.eliminar(emailNorm);
      throw new BadRequestError(
        "El código ha expirado por seguridad (límite 15 minutos). Solicita uno nuevo.",
      );
    }

    if (Number(registro.intentos) >= OTP_INTENTOS_MAX) {
      await CodigoRecuperacionModel.eliminar(emailNorm);
      throw new TooManyRequestsError(
        "Has excedido el número máximo de intentos. Solicita un nuevo código.",
      );
    }

    if (registro.codigo !== codigo.trim()) {
      await CodigoRecuperacionModel.incrementarIntentos(emailNorm);
      const intentos = Number(registro.intentos) + 1;
      if (intentos >= OTP_INTENTOS_MAX) {
        await CodigoRecuperacionModel.eliminar(emailNorm);
        throw new TooManyRequestsError(
          "Has excedido el número máximo de intentos. Solicita un nuevo código.",
        );
      }
      throw new BadRequestError(
        `Código de seguridad incorrecto. Intento ${intentos} de ${OTP_INTENTOS_MAX}.`,
      );
    }

    await CodigoRecuperacionModel.marcarVerificado(emailNorm);

    return sendSuccess(res, { valido: true }, {
      message:
        "Código de seguridad validado con éxito. Ya puedes establecer tu nueva contraseña.",
    });
  } catch (error) {
    return next(error);
  }
};

// Restablecer contraseña con nueva clave (exige validación previa del código de seguridad)
export const restablecerPassword = async (req, res, next) => {
  try {
    const { email, codigo, password_nuevo } = req.body;
    if (
      typeof email !== "string" ||
      typeof codigo !== "string" ||
      typeof password_nuevo !== "string" ||
      !email.trim() ||
      !codigo.trim()
    ) {
      throw new BadRequestError(
        "El correo, el código y la nueva contraseña son obligatorios",
      );
    }

    if (password_nuevo.length < 8 || password_nuevo.length > 128) {
      throw new BadRequestError(
        "La nueva contraseña debe tener entre 8 y 128 caracteres",
      );
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password_nuevo)) {
      throw new BadRequestError(
        "La nueva contraseña debe incluir al menos una mayúscula, una minúscula y un número",
      );
    }

    const emailNorm = email.trim().toLowerCase();
    const nuevoPasswordHash = await bcrypt.hash(password_nuevo, SALT_ROUNDS);
    const resultado = await CodigoRecuperacionModel.restablecerPassword({
      email: emailNorm,
      codigo: codigo.trim(),
      passwordHash: nuevoPasswordHash,
      ahora: Date.now(),
      intentosMax: OTP_INTENTOS_MAX,
    });

    if (resultado === "attempts-exceeded") {
      throw new TooManyRequestsError(
        "Has excedido el número máximo de intentos. Solicita un nuevo código.",
      );
    }
    if (resultado !== "success") {
      throw new ForbiddenError(
        "No se pudo restablecer la contraseña. Verifica el código vigente y vuelve a solicitar uno si expiró.",
      );
    }

    return sendSuccess(res, null, {
      message:
        "Tu contraseña ha sido restablecida exitosamente. Ya puedes iniciar sesión de forma segura.",
    });
  } catch (error) {
    return next(error);
  }
};
