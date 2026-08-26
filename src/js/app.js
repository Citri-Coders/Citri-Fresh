/**
 * CitriFresh - JavaScript Principal
 * Manejo de sesión, roles (cliente vs productor), navegación dinámica y micro-interacciones
 */

const CitriAuth = {
    getUser: function() {
        try {
            const userJson = localStorage.getItem('citrifresh_user');
            return userJson ? JSON.parse(userJson) : null;
        } catch (e) {
            return null;
        }
    },
    setUser: function(user) {
        localStorage.setItem('citrifresh_user', JSON.stringify(user));
        this.updateNavUI();
    },
    logout: function() {
        localStorage.removeItem('citrifresh_user');
        localStorage.removeItem('citrifresh_cart');
        window.location.href = window.location.pathname.includes('/auth/') ? '../inicio.html' : 'inicio.html';
    },
    isLoggedIn: function() {
        return !!this.getUser();
    },
    getRole: function() {
        const user = this.getUser();
        return user ? user.role : 'guest'; // 'guest' | 'cliente' | 'productor'
    },
    requireAuth: function(allowedRoles = ['cliente', 'productor']) {
        const user = this.getUser();
        if (!user) {
            const isInsidePages = window.location.pathname.includes('/pages/');
            const loginUrl = isInsidePages ? (window.location.pathname.includes('/auth/') ? 'login.html' : 'auth/login.html') : 'pages/auth/login.html';
            window.location.href = loginUrl;
            return false;
        }
        if (!allowedRoles.includes(user.role)) {
            alert('Acceso restringido para este tipo de cuenta.');
            if (user.role === 'productor') {
                window.location.href = 'panel_productor.html';
            } else {
                window.location.href = 'perfil.html';
            }
            return false;
        }
        return true;
    },
    updateNavUI: function() {
        const navActions = document.querySelector('.nav-actions');
        if (!navActions) return;

        const user = this.getUser();
        const role = user ? user.role : 'guest';
        const isAuthPage = window.location.pathname.includes('/auth/');
        const prefix = isAuthPage ? '../' : '';

        // Si es invitado (No autenticado)
        if (role === 'guest') {
            navActions.innerHTML = `
                <a href="${prefix}auth/login.html" class="btn btn-primary">
                    <span class="material-symbols-outlined" style="font-size: 18px;">login</span>
                    <span>Ingresar</span>
                </a>
                <button class="mobile-menu-btn" aria-label="Abrir Menú">
                    <span class="material-symbols-outlined">menu</span>
                </button>
            `;
        } 
        // Si es Cliente (Comprador) -> Carrito y Perfil
        else if (role === 'cliente') {
            const userName = user.name || 'Cliente';
            navActions.innerHTML = `
                <a href="${prefix}carrito.html" class="btn btn-icon text-primary" title="Carrito de Compras" style="position: relative;">
                    <span class="material-symbols-outlined" style="font-size: 26px;">shopping_cart</span>
                    <span class="cart-count-badge" style="position: absolute; top: 0; right: 0; background: var(--color-accent); color: white; border-radius: 50%; font-size: 11px; font-weight: 700; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center;">2</span>
                </a>
                <a href="${prefix}perfil.html" class="hidden md-flex items-center gap-xs" style="background-color: var(--color-surface-container); padding: 0.4rem 0.85rem; border-radius: var(--radius-lg); border: 1px solid var(--color-border); text-decoration: none; color: var(--color-primary);">
                    <span class="material-symbols-outlined">person</span>
                    <span style="font-weight: 700; font-size: var(--text-label);">${userName}</span>
                </a>
                <button onclick="CitriAuth.logout()" class="btn btn-icon text-muted hover:text-primary" title="Cerrar Sesión">
                    <span class="material-symbols-outlined">logout</span>
                </button>
                <button class="mobile-menu-btn" aria-label="Abrir Menú">
                    <span class="material-symbols-outlined">menu</span>
                </button>
            `;
        } 
        // Si es Productor -> Panel Productor y Subir Cosecha (NO Carrito)
        else if (role === 'productor') {
            const userName = user.name || 'Finca Productor';
            navActions.innerHTML = `
                <a href="${prefix}registro_cosecha.html" class="btn btn-accent hidden md-flex items-center gap-xs" style="font-size: 0.8125rem; padding: 0.5rem 1rem;">
                    <span class="material-symbols-outlined" style="font-size: 18px;">add_circle</span>
                    <span>Nueva Cosecha</span>
                </a>
                <a href="${prefix}panel_productor.html" class="hidden md-flex items-center gap-xs" style="background-color: rgba(0,109,52,0.1); padding: 0.4rem 0.85rem; border-radius: var(--radius-lg); border: 1px solid var(--color-secondary-container); text-decoration: none; color: var(--color-secondary);">
                    <span class="material-symbols-outlined" style="font-size: 18px;">agriculture</span>
                    <span style="font-weight: 700; font-size: var(--text-label);">${userName}</span>
                </a>
                <button onclick="CitriAuth.logout()" class="btn btn-icon text-muted hover:text-primary" title="Cerrar Sesión">
                    <span class="material-symbols-outlined">logout</span>
                </button>
                <button class="mobile-menu-btn" aria-label="Abrir Menú">
                    <span class="material-symbols-outlined">menu</span>
                </button>
            `;
        }
    }
};

document.addEventListener('DOMContentLoaded', function () {
    // 1. Inicializar UI de sesión según rol
    CitriAuth.updateNavUI();

    // 2. Controladores de inicio de sesión y registro si existen en la página
    const loginForm = document.querySelector('.auth-form');
    if (loginForm && window.location.pathname.includes('/auth/login.html')) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = loginForm.querySelector('input[type="email"]');
            const email = emailInput ? emailInput.value.toLowerCase() : '';
            
            // Si el correo contiene "productor" o "finca", se asume perfil productor; de lo contrario cliente mayorista
            let role = 'cliente';
            let name = 'Juan Pérez';
            if (email.includes('productor') || email.includes('finca') || email.includes('agri')) {
                role = 'productor';
                name = 'Finca San José';
            }

            CitriAuth.setUser({
                email: email || 'usuario@citrifresh.ni',
                name: name,
                role: role
            });

            // Redirección según rol
            if (role === 'productor') {
                window.location.href = '../panel_productor.html';
            } else {
                window.location.href = '../producto.html';
            }
        });
    }

    // Registro
    const registerForm = document.querySelector('.auth-form');
    if (registerForm && window.location.pathname.includes('registro.html')) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const roleSelected = registerForm.querySelector('input[name="role"]:checked')?.value || 'cliente';
            const nameInput = registerForm.querySelector('input[placeholder="Carlos"], input[placeholder="Nombres"]');
            const emailInput = registerForm.querySelector('input[type="email"]');

            const name = nameInput?.value ? nameInput.value : (roleSelected === 'productor' ? 'Productor Citrícola' : 'Cliente Mayorista');
            const email = emailInput?.value || 'usuario@citrifresh.ni';

            CitriAuth.setUser({
                email: email,
                name: name,
                role: roleSelected
            });

            if (roleSelected === 'productor') {
                window.location.href = 'panel_productor.html';
            } else {
                window.location.href = 'producto.html';
            }
        });
    }

    // ---------- MENU MOBILE ----------
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

    // ---------- CONTROL DE ACCIONES DE CARRITO EN PRODUCTOS ----------
    document.querySelectorAll('.btn-cart').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const user = CitriAuth.getUser();
            if (!user) {
                e.preventDefault();
                e.stopPropagation();
                if (confirm('Debes iniciar sesión como Cliente para agregar productos y comprar. ¿Deseas ingresar ahora?')) {
                    const isInsidePages = window.location.pathname.includes('/pages/');
                    window.location.href = isInsidePages ? (window.location.pathname.includes('/auth/') ? 'login.html' : 'auth/login.html') : 'pages/auth/login.html';
                }
                return;
            }
            if (user.role === 'productor') {
                e.preventDefault();
                e.stopPropagation();
                alert('Las cuentas de Productor no gestionan compras con carrito. Tu rol tiene acceso al Panel del Productor.');
                window.location.href = 'panel_productor.html';
                return;
            }
            
            // Animación feedback
            const originalHtml = this.innerHTML;
            this.innerHTML = '<span class="material-symbols-outlined">check</span> ¡Agregado!';
            this.style.backgroundColor = 'var(--color-primary-container)';
            this.style.color = '#ffffff';
            setTimeout(() => {
                this.innerHTML = originalHtml;
                this.removeAttribute('style');
            }, 1400);
        });
    });
});