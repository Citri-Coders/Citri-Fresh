// ==================== INICIALIZACIÓN DE LA PÁGINA ====================
document.addEventListener('DOMContentLoaded', function () {
    // 1. Inicializar barra de navegación según sesión y sincronizar con backend
    CitriAuth.updateNavUI();
    if (CitriAuth.getUser()) {
        CitriAuth.syncWithServer().catch(() => {});
    }

    // 2. Control del Formulario de Inicio de Sesión (Login real contra Backend)
    const loginForm = document.getElementById('login-form') || document.querySelector('#login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const emailInput = loginForm.querySelector('input[type="email"]');
            const passwordInput = loginForm.querySelector('input[type="password"]');
            const submitBtn = loginForm.querySelector('button[type="submit"]');

            const email = emailInput ? emailInput.value.trim() : '';
            const password = passwordInput ? passwordInput.value : '';

            if (!email || !password) {
                alert('Por favor completa todos los campos.');
                return;
            }

            const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span>Verificando...</span>';
            }

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (!response.ok) {
                    alert(data.error || 'Credenciales inválidas. Verifica tu correo y contraseña.');
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnHtml;
                    }
                    return;
                }

                // Guardar usuario real de la BD
                CitriAuth.setUser(data.data);

                // Redirigir según el rol retornado por la base de datos
                if (data.data.rol === 'admin' || data.data.rol === 'auditor') {
                    window.location.href = '../admin.html';
                } else if (data.data.rol === 'productor') {
                    window.location.href = '../panel_productor.html';
                } else {
                    window.location.href = '../perfil.html';
                }
            } catch (error) {
                console.error('Error en login:', error);
                alert('No se pudo conectar con el servidor. Intenta de nuevo.');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnHtml;
                }
            }
        });

        // Conectar enlace y modal de "¿Olvidaste tu contraseña?"
        inicializarRecuperarPassword();
    }

    // 3. Control del Formulario de Registro
    // La lógica de registro dinámico con soporte de perfiles (Cliente, Productor, Administrador)
    // está implementada en procesarRegistroDinamico() dentro de registro.html.


    // 4. Inicializar botones de "Continuar con Google" (Login y Registro)
    inicializarBotonGoogle();

    // 4. Cargar datos dinámicos en la página de Perfil (Cliente)
    if (window.location.pathname.includes('perfil.html')) {
        cargarPerfilUsuario();
    }

    // 5. Cargar datos dinámicos en Panel Productor
    if (window.location.pathname.includes('panel_productor.html')) {
        cargarPanelProductor();
    }

    // 6. Conectar Catálogo de Productos dinámico con el Backend
    if (window.location.pathname.includes('producto.html')) {
        cargarCatalogoDesdeBD();
    }

    // 7. Conectar Formulario de Nueva Cosecha con el Backend
    if (window.location.pathname.includes('registro_cosecha.html')) {
        inicializarFormularioCosecha();
    }

    // 8. Calcular automáticamente temporada y año de cosecha en inicio.html
    if (window.location.pathname.includes('inicio.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
        calcularCosechaAutomatica();
    }

    // ---------- MENÚ MOBILE ----------
    const menuToggle = document.querySelector('.mobile-menu-btn, .menu-toggle');
    const navMenu = document.querySelector('.nav-menu, .main-nav');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function () {
            const isOpen = navMenu.classList.toggle('is-open');
            menuToggle.setAttribute('aria-expanded', isOpen);
            if (isOpen) {
                navMenu.style.display = 'flex';
                navMenu.style.flexDirection = 'column';
                navMenu.style.position = 'absolute';
                navMenu.style.top = '100%';
                navMenu.style.left = '0';
                navMenu.style.width = '100%';
                navMenu.style.backgroundColor = '#ffffff';
                navMenu.style.padding = '1.5rem';
                navMenu.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
            } else {
                navMenu.removeAttribute('style');
            }
        });
    }
});
