// Helper para construir respuestas de éxito con un formato uniforme:
//   { success: true, data: <recurso>, message?: <mensaje opcional> }
// Los errores se estandarizan vía el middleware global usando AppError.

export const sendSuccess = (res, data = null, { status = 200, message } = {}) => {
  const body = { success: true, data };
  if (message) body.message = message;
  return res.status(status).json(body);
};
