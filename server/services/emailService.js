import nodemailer from "nodemailer";

// Variable en memoria para retener el último correo enviado y permitir previsualización inmediata en local
let ultimoCorreoEnviado = null;

let transporterInstance = null;

/**
 * Obtener o inicializar el transporte de Nodemailer.
 * Si existen variables SMTP en .env las utiliza; de lo contrario crea una cuenta de pruebas Ethereal real.
 */
async function getTransporter() {
  if (transporterInstance) return transporterInstance;

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporterInstance = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    console.log(`[Citri-Fresh Email] Conectado a servidor SMTP: ${process.env.SMTP_HOST}`);
  } else {
    // Modo de desarrollo: Crear cuenta Ethereal en tiempo real para generar previsualizaciones oficiales
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporterInstance = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log(`[Citri-Fresh Email] Canal de envío activo vía Ethereal (${testAccount.user})`);
    } catch (err) {
      // Fallback a transporte JSON directo si hay problemas de red con Ethereal
      console.warn("[Citri-Fresh Email] Usando transporte simulado seguro en memoria.");
      transporterInstance = nodemailer.createTransport({
        jsonTransport: true,
      });
    }
  }

  return transporterInstance;
}

/**
 * Enviar correo con código de seguridad OTP para recuperación de contraseña
 */
export async function enviarCorreoRecuperacion({ email, nombre, codigo }) {
  const transporter = await getTransporter();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px; }
        .card { max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
        .header { background: linear-gradient(135deg, #006837 0%, #15803d 100%); color: white; padding: 28px 24px; text-align: center; }
        .logo-title { font-size: 24px; font-weight: 800; letter-spacing: -0.5px; margin: 0; }
        .sub { font-size: 13px; color: rgba(255,255,255,0.85); margin-top: 4px; }
        .body { padding: 32px 28px; color: #1e293b; }
        .greeting { font-size: 18px; font-weight: 700; margin-bottom: 12px; }
        .text { font-size: 14.5px; line-height: 1.6; color: #475569; margin-bottom: 24px; }
        .otp-container { background: #f0fdf4; border: 2px dashed #006837; border-radius: 16px; padding: 20px; text-align: center; margin-bottom: 24px; }
        .otp-label { font-size: 12px; font-weight: 800; text-transform: uppercase; color: #006837; letter-spacing: 1px; margin-bottom: 8px; }
        .otp-code { font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #006837; font-family: monospace; }
        .notice { font-size: 12.5px; color: #64748b; line-height: 1.5; border-top: 1px solid #f1f5f9; padding-top: 16px; margin-top: 16px; }
        .footer { background: #f8fafc; padding: 18px 24px; text-align: center; font-size: 11.5px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1 class="logo-title">CITRI-FRESH</h1>
          <div class="sub">Plataforma de Comercialización Citrícola de Nicaragua</div>
        </div>
        <div class="body">
          <div class="greeting">Hola, ${nombre || "Estimado Usuario"}</div>
          <p class="text">
            Recibimos una solicitud para restablecer la contraseña de tu cuenta en <b>Citri-Fresh</b>. Utiliza el siguiente código de seguridad único para continuar:
          </p>
          <div class="otp-container">
            <div class="otp-label">Código de Seguridad OTP</div>
            <div class="otp-code">${codigo}</div>
            <div style="font-size: 11.5px; color: #047857; margin-top: 6px; font-weight: 600;">Válido por 15 minutos</div>
          </div>
          <p class="text" style="font-size: 13.5px;">
            Si tú no solicitaste este cambio, puedes ignorar este mensaje; tu cuenta permanecerá completamente segura.
          </p>
          <div class="notice">
            🔒 <b>Aviso de Seguridad:</b> El personal de Citri-Fresh nunca te solicitará este código por teléfono, WhatsApp o redes sociales.
          </div>
        </div>
        <div class="footer">
          © 2026 Citri-Fresh S.A. Todos los derechos reservados. Managua, Nicaragua.
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: '"Seguridad Citri-Fresh" <seguridad@citrifresh.ni>',
      to: email,
      subject: `Código de Recuperación: ${codigo} - Citri-Fresh`,
      text: `Tu código de verificación de Citri-Fresh es: ${codigo}. Válido por 15 minutos.`,
      html: htmlContent,
    });

    let previewUrl = null;
    try {
      previewUrl = nodemailer.getTestMessageUrl(info);
    } catch (e) {}

    ultimoCorreoEnviado = {
      destinatario: email,
      nombre,
      codigo,
      asunto: `Código de Recuperación: ${codigo} - Citri-Fresh`,
      fecha: new Date().toISOString(),
      previewUrl,
      htmlContent,
    };

    console.log(`[Citri-Fresh Email] Despachado correo a ${email}. ID: ${info.messageId}`);
    if (previewUrl) {
      console.log(`[Citri-Fresh Email] Ver mensaje en Ethereal: ${previewUrl}`);
    }

    return { exito: true, previewUrl };
  } catch (error) {
    console.error("[Citri-Fresh Email Error]:", error);
    // Guardar para fallback
    ultimoCorreoEnviado = {
      destinatario: email,
      nombre,
      codigo,
      asunto: `Código de Recuperación: ${codigo} - Citri-Fresh`,
      fecha: new Date().toISOString(),
      htmlContent,
    };
    return { exito: false, error: error.message };
  }
}

/**
 * Obtener el último correo despachado (útil para pruebas en vivo y demostración visual en frontend)
 */
export function getUltimoCorreoEnviado() {
  return ultimoCorreoEnviado;
}
