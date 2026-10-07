// Jerarquía de errores de aplicación. Permite que los controladores y servicios
// lancen errores con un código HTTP explícito y que un único middleware global
// construya la respuesta JSON estandarizada.

export class AppError extends Error {
  constructor(message, statusCode = 500, { details = undefined } = {}) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = true;
    this.details = details;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Solicitud inválida", options) {
    super(message, 400, options);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "No autorizado", options) {
    super(message, 401, options);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Acceso denegado", options) {
    super(message, 403, options);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Recurso no encontrado", options) {
    super(message, 404, options);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflicto con el estado actual del recurso", options) {
    super(message, 409, options);
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message = "Demasiadas peticiones", options) {
    super(message, 429, options);
  }
}
