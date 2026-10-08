// ==================== GOOGLE SIGN-IN CON GOOGLE IDENTITY SERVICES (GIS) ====================

// --- Función de seguridad: escape HTML para prevenir XSS ---
function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    if (typeof str !== 'string') str = String(str);
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function escapeAttr(str) {
    if (str === null || str === undefined) return '';
    if (typeof str !== 'string') str = String(str);
    return str
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

// Cache del Google Client ID cargado desde el backend
let _googleClientId = null;

async function obtenerGoogleClientId() {
    if (_googleClientId) return _googleClientId;
    try {
        const res = await fetch('/api/auth/config');
        if (res.ok) {
            const data = await res.json();
            _googleClientId = data.data?.googleClientId || null;
        }
    } catch (err) {
        console.warn('[CitriFresh] No se pudo obtener configuracion de Google:', err);
    }
    return _googleClientId;
}

/**
 * Inicializa el boton "Continuar con Google" usando Google Identity Services (GIS).
 * Usa google.accounts.id.renderButton — popup oficial de Google, sin redirect_uri.
 */
function inicializarBotonGoogle() {
    const googleBtns = document.querySelectorAll('.btn-social-google');
    if (!googleBtns.length) return;

    const isInsideAuth = window.location.pathname.includes('/auth/');
    const redirectPrefix = isInsideAuth ? '../' : '';

    function cargarGSI(callback) {
        if (window.google && window.google.accounts && window.google.accounts.id) {
            callback();
            return;
        }
        if (document.getElementById('google-gsi-client')) {
            const interval = setInterval(() => {
                if (window.google && window.google.accounts && window.google.accounts.id) {
                    clearInterval(interval);
                    callback();
                }
            }, 150);
            return;
        }
        const script = document.createElement('script');
        script.id = 'google-gsi-client';
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = callback;
        script.onerror = () => console.warn('[CitriFresh] No se pudo cargar el script de Google GSI.');
        document.head.appendChild(script);
    }

    async function inicializar() {
        const GOOGLE_CLIENT_ID = await obtenerGoogleClientId();
        if (!GOOGLE_CLIENT_ID) {
            console.warn('[CitriFresh] Google Client ID no disponible.');
            googleBtns.forEach(btn => btn.style.display = 'none');
            return;
        }

        cargarGSI(() => {
            if (!window.google || !window.google.accounts || !window.google.accounts.id) {
                console.warn('[CitriFresh] Google GSI no cargo correctamente.');
                return;
            }

            // Inicializar con el callback que recibe el credential JWT de Google
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: (response) => manejarCredencialGoogle(response, redirectPrefix),
                ux_mode: 'popup',
                cancel_on_tap_outside: true,
            });

            // Reemplazar cada boton .btn-social-google con el boton oficial renderizado por Google
            googleBtns.forEach((btn, idx) => {
                const container = document.createElement('div');
                container.id = 'google-btn-container-' + idx;
                // Copiar clases de ancho del boton original para que encaje visualmente
                container.style.cssText = 'display:flex;justify-content:center;width:100%;';
                btn.parentNode.insertBefore(container, btn);
                btn.style.display = 'none';

                // Calcular ancho disponible para el boton de Google
                const ancho = Math.min(btn.offsetWidth || 320, 400);

                window.google.accounts.id.renderButton(container, {
                    type: 'standard',
                    shape: 'rectangular',
                    theme: 'outline',
                    text: 'continue_with',
                    size: 'large',
                    locale: 'es',
                    width: ancho,
                });
            });
        });
    }

    inicializar();
}

/**
 * Callback que Google llama tras autenticacion exitosa.
 * Recibe el credential JWT firmado por Google.
 */
async function manejarCredencialGoogle(response, redirectPrefix) {
    if (!response || !response.credential) {
        alert('No se recibio respuesta valida de Google. Intenta de nuevo.');
        return;
    }
    await enviarCredencialGoogleAlBackend({ credential: response.credential }, redirectPrefix || '');
}

// Enviar el credential JWT de Google al backend para verificacion criptografica y login/registro
async function enviarCredencialGoogleAlBackend(datosGoogle, redirectPrefix) {
    try {
        const submitBtns = document.querySelectorAll('.btn-auth-submit');
        submitBtns.forEach(b => { b.disabled = true; b.textContent = 'Verificando...'; });

        const res = await fetch('/api/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ ...datosGoogle, rol: 'cliente' })
        });

        const data = await res.json();

        submitBtns.forEach(b => { b.disabled = false; });

        if (res.ok) {
            CitriAuth.setUser(data.data);
            if (data.data.rol === 'admin' || data.data.rol === 'auditor') {
                window.location.href = redirectPrefix + 'admin.html';
            } else if (data.data.rol === 'productor') {
                window.location.href = redirectPrefix + 'panel_productor.html';
            } else {
                window.location.href = redirectPrefix + 'perfil.html';
            }
        } else {
            alert(data.error || 'Error al autenticar con Google. Intenta de nuevo.');
        }
    } catch (err) {
        console.error('[CitriFresh] Error Google Auth:', err);
        alert('No se pudo conectar con el servidor. Verifica tu conexion e intenta de nuevo.');
    }
}

// ==================== FLUJO DE RECUPERACIÓN DE CONTRASEÑA ====================
function inicializarRecuperarPassword() {
    const forgotLink = document.querySelector('.forgot-link');
    const modal = document.getElementById('modal-recuperar-password');
    if (!forgotLink || !modal) return;

    const btnCerrar = document.getElementById('btn-cerrar-recuperar');
    const btnCancelar = document.getElementById('btn-cancelar-recuperar');
    const formPaso1 = document.getElementById('form-recuperar-paso1');
    const formPaso2 = document.getElementById('form-recuperar-paso2');
    const formPaso3 = document.getElementById('form-recuperar-paso3');
    const emailInput = document.getElementById('recuperar-email');
    const codigoInput = document.getElementById('recuperar-codigo-input');
    const error1 = document.getElementById('recuperar-error-1');
    const error2 = document.getElementById('recuperar-error-2');
    const error3 = document.getElementById('recuperar-error-3');
    const codigoInfo = document.getElementById('recuperar-codigo-info');
    const exitoInfo = document.getElementById('recuperar-exito-info');
    const btnVolver = document.getElementById('btn-volver-paso1');
    const passNuevo = document.getElementById('recuperar-password-nuevo');
    const passConfirm = document.getElementById('recuperar-password-confirm');

    let emailValidado = '';
    let codigoValidado = '';

    const abrirModal = (e) => {
        if (e) e.preventDefault();
        modal.style.display = 'flex';
        formPaso1.style.display = 'block';
        formPaso2.style.display = 'none';
        if (formPaso3) formPaso3.style.display = 'none';
        error1.style.display = 'none';
        if (error2) error2.style.display = 'none';
        if (error3) error3.style.display = 'none';
        if (emailInput) {
            emailInput.value = '';
            setTimeout(() => emailInput.focus(), 100);
        }
    };

    const cerrarModal = () => {
        modal.style.display = 'none';
    };

    forgotLink.addEventListener('click', abrirModal);
    if (btnCerrar) btnCerrar.addEventListener('click', cerrarModal);
    if (btnCancelar) btnCancelar.addEventListener('click', cerrarModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) cerrarModal();
    });

    // Paso 1: Generar y solicitar envío de código OTP
    if (formPaso1) {
        formPaso1.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = emailInput.value.trim();
            error1.style.display = 'none';

            const submitBtn = document.getElementById('btn-submit-verificar-correo');
            submitBtn.disabled = true;
            const originalBtn = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Generando código...</span>';

            try {
                const res = await fetch('/api/auth/recuperar-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });
                const data = await res.json();

                if (!res.ok) {
                    error1.textContent = data.error || 'No se encontró ninguna cuenta con ese correo.';
                    error1.style.display = 'block';
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtn;
                    return;
                }

                emailValidado = data.data.email;
                const safeEmail = escapeHtml(data.data.email);
                const safePreviewUrl = escapeAttr(data.data.previewUrl || '');
                const previewLinkHtml = data.data.previewUrl 
                    ? `<div style="margin-top: 8px;"><a href="${safePreviewUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="font-size: 0.75rem; padding: 4px 10px; display: inline-flex; align-items: center; gap: 4px; border-radius: 8px; color: #006837; border-color: #006837; text-decoration: none;"><span class="material-symbols-outlined" style="font-size: 16px;">open_in_new</span> Abrir Correo en Servidor de Pruebas (Ethereal)</a></div>`
                    : `<div style="margin-top: 8px;"><button type="button" onclick="verBuzonSimulado('${safeEmail}')" style="background: none; border: none; padding: 0; color: #006837; font-size: 0.75rem; font-weight: 700; text-decoration: underline; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;"><span class="material-symbols-outlined" style="font-size: 16px;">mail</span> ¿No tienes acceso a este correo? Ver bandeja local de prueba</button></div>`;

                codigoInfo.innerHTML = `
                    <div style="display: flex; align-items: flex-start; gap: 8px;">
                        <span class="material-symbols-outlined" style="font-size: 20px; color: #006837; margin-top: 2px;">mark_email_read</span>
                        <div>
                            <strong>¡Correo electrónico enviado con éxito!</strong><br>
                            Hemos despachado la clave de seguridad de 6 dígitos a <u>${safeEmail}</u>.<br>
                            <span style="font-size: 0.8rem; color: #475569; display: block; margin-top: 4px;">Revisa tu bandeja de entrada o carpeta de no deseados (spam) y escribe el código abajo.</span>
                            ${previewLinkHtml}
                        </div>
                    </div>
                `;
                
                formPaso1.style.display = 'none';
                formPaso2.style.display = 'block';
                if (formPaso3) formPaso3.style.display = 'none';
                if (codigoInput) {
                    codigoInput.value = '';
                    codigoInput.focus();
                }
            } catch (err) {
                console.error('Error al solicitar recuperación:', err);
                error1.textContent = 'Error de conexión con el servidor. Intenta de nuevo.';
                error1.style.display = 'block';
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtn;
            }
        });
    }

    // Botón volver a paso 1
    if (btnVolver) {
        btnVolver.addEventListener('click', () => {
            formPaso2.style.display = 'none';
            formPaso1.style.display = 'block';
            error2.style.display = 'none';
        });
    }

    // Paso 2: Validar código de seguridad OTP en el backend
    if (formPaso2) {
        formPaso2.addEventListener('submit', async (e) => {
            e.preventDefault();
            const codigo = codigoInput ? codigoInput.value.trim() : '';
            error2.style.display = 'none';

            if (!codigo || codigo.length !== 6) {
                error2.textContent = 'Por favor ingresa el código de 6 dígitos numéricos.';
                error2.style.display = 'block';
                return;
            }

            const submitBtn = document.getElementById('btn-submit-validar-codigo');
            submitBtn.disabled = true;
            const orig = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Verificando código...</span>';

            try {
                const res = await fetch('/api/auth/verificar-codigo-recuperacion', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: emailValidado, codigo })
                });
                const data = await res.json();

                if (!res.ok) {
                    error2.textContent = data.error || 'Código de seguridad inválido o expirado.';
                    error2.style.display = 'block';
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = orig;
                    return;
                }

                codigoValidado = codigo;
                exitoInfo.innerHTML = `✓ Código validado correctamente para <b>${escapeHtml(emailValidado)}</b>. Establece tu nueva contraseña segura.`;

                formPaso2.style.display = 'none';
                if (formPaso3) formPaso3.style.display = 'block';
                if (passNuevo) {
                    passNuevo.value = '';
                    if (passConfirm) passConfirm.value = '';
                    passNuevo.focus();
                }
            } catch (err) {
                console.error('Error al validar código:', err);
                error2.textContent = 'Error al verificar con el servidor.';
                error2.style.display = 'block';
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = orig;
            }
        });
    }

    // Paso 3: Guardar nueva contraseña autorizada por el código
    if (formPaso3) {
        formPaso3.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nueva = passNuevo.value;
            const confirm = passConfirm.value;
            error3.style.display = 'none';

            if (nueva.length < 8) {
                error3.textContent = 'La nueva contraseña debe tener al menos 8 caracteres.';
                error3.style.display = 'block';
                return;
            }

            if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(nueva)) {
                error3.textContent = 'La contraseña debe incluir al menos una mayúscula, una minúscula y un número.';
                error3.style.display = 'block';
                return;
            }

            if (nueva !== confirm) {
                error3.textContent = 'Las contraseñas ingresadas no coinciden.';
                error3.style.display = 'block';
                return;
            }

            const submitBtn = document.getElementById('btn-submit-nueva-clave');
            submitBtn.disabled = true;
            const orig = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Guardando...</span>';

            try {
                const res = await fetch('/api/auth/restablecer-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: emailValidado,
                        codigo: codigoValidado,
                        password_nuevo: nueva
                    })
                });
                const data = await res.json();

                if (!res.ok) {
                    error3.textContent = data.error || 'Error al restablecer la contraseña.';
                    error3.style.display = 'block';
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = orig;
                    return;
                }

                alert('¡Tu contraseña ha sido actualizada con éxito! Ahora puedes iniciar sesión.');
                cerrarModal();

                // Prellenar correo en el formulario principal de login
                const mainEmailInput = document.querySelector('.auth-form input[type="email"]');
                const mainPassInput = document.querySelector('.auth-form input[type="password"]');
                if (mainEmailInput) mainEmailInput.value = emailValidado;
                if (mainPassInput) {
                    mainPassInput.value = '';
                    mainPassInput.focus();
                }
            } catch (err) {
                console.error('Error al restablecer contraseña:', err);
                error3.textContent = 'Error al conectar con el servidor.';
                error3.style.display = 'block';
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = orig;
            }
        });
    }
}

// Ventana de buzón de correo local simulado
window.verBuzonSimulado = async function(email) {
    try {
        const res = await fetch('/api/auth/ultimo-correo-enviado');
        if (!res.ok) {
            alert('Aún no se ha despachado ningún correo.');
            return;
        }
        const correo = await res.json();
        
        let modalBuzon = document.getElementById('modal-buzon-simulado');
        if (!modalBuzon) {
            modalBuzon = document.createElement('div');
            modalBuzon.id = 'modal-buzon-simulado';
            modalBuzon.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(15,23,42,0.7);backdrop-filter:blur(6px);z-index:9999;display:flex;align-items:center;justify-content:center;padding:1rem;';
            document.body.appendChild(modalBuzon);
        }

        modalBuzon.innerHTML = `
            <div style="background:white;border-radius:24px;max-width:580px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 25px 50px -12px rgba(0,0,0,0.35);padding:1.5rem;position:relative;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;border-bottom:1px solid #e2e8f0;padding-bottom:0.75rem;">
                    <div>
                        <strong style="color:#006837;font-size:1.1rem;display:flex;align-items:center;gap:6px;">
                            <span class="material-symbols-outlined">mark_email_read</span> Bandeja de Entrada Citri-Fresh
                        </strong>
                        <span style="font-size:0.75rem;color:#64748b;">Para: ${escapeHtml(correo.data.destinatario)} • ${escapeHtml(new Date(correo.data.fecha).toLocaleTimeString())}</span>
                    </div>
                    <button onclick="document.getElementById('modal-buzon-simulado').style.display='none'" style="background:none;border:none;cursor:pointer;color:#64748b;padding:4px;">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div style="border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;background:#f8fafc;">
                    <iframe srcdoc="${escapeAttr(correo.data.htmlContent)}" sandbox="allow-same-origin" style="width:100%;min-height:300px;border:none;display:block;" title="Vista previa del correo"></iframe>
                </div>
                <div style="margin-top:1rem;text-align:right;">
                    <button onclick="document.getElementById('modal-buzon-simulado').style.display='none'" class="btn btn-primary" style="padding:0.5rem 1.25rem;font-size:0.85rem;border-radius:10px;">
                        Entendido / Cerrar
                    </button>
                </div>
            </div>
        `;
        modalBuzon.style.display = 'flex';
    } catch (e) {
        console.error('Error al ver buzón simulado:', e);
        alert('No se pudo cargar la vista previa del correo.');
    }
};




