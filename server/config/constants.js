// Constantes centralizadas del dominio Citri-Fresh.
// Evita cadenas mágicas repetidas en controladores, modelos y middlewares.

export const ROLES = Object.freeze({
  ADMIN: "admin",
  PRODUCTOR: "productor",
  CLIENTE: "cliente",
  AUDITOR: "auditor",
});

export const ROLES_VALIDOS = Object.freeze(Object.values(ROLES));

// Roles que un usuario puede elegir libremente al registrarse.
export const ROLES_AUTO_REGISTRO = Object.freeze([
  ROLES.CLIENTE,
  ROLES.PRODUCTOR,
]);

export const ESTADOS_PEDIDO = Object.freeze({
  PENDIENTE: "pendiente",
  PAGADO: "pagado",
  ENVIADO: "enviado",
  COMPLETADO: "completado",
  CANCELADO: "cancelado",
});

export const ESTADOS_PEDIDO_VALIDOS = Object.freeze(
  Object.values(ESTADOS_PEDIDO),
);

// Límites de longitud máxima por campo de entrada (H18).
export const LIMITES_CAMPOS = Object.freeze({
  nombre: 100,
  email: 254,
  password: 128,
  password_actual: 128,
  password_nuevo: 128,
  telefono: 30,
  direccion: 255,
  nombre_finca: 100,
  zona_cultivo: 100,
  capacidad_produccion: 100,
  tipos_citricos: 255,
  foto: 2000000,
  descripcion: 1000,
});

export const NOMBRE_COOKIE_TOKEN = "token";

export const OTP_INTENTOS_MAX = 5;
export const OTP_VIGENCIA_MS = 15 * 60 * 1000; // 15 minutos

export const UNIDAD_PRODUCTO_DEFAULT = "unidad";
