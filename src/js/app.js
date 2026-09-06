/**
 * CitriFresh - JavaScript Principal
 * Integración Backend & API REST + SQLite DB
 * Manejo de sesión real, autenticación, perfiles dinámicos y catálogo
 */

// ── Sistema de Notificaciones y Diálogos Elegantes Citri-Fresh ──────────────
(function() {
    // Reemplazar window.alert con un modal con diseño de marca Citri-Fresh
    window.alert = function(mensaje) {
        return new Promise((resolve) => {
            let modal = document.getElementById('citri-custom-alert-modal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'citri-custom-alert-modal';
                modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(15,23,42,0.65);backdrop-filter:blur(6px);z-index:999999;display:flex;align-items:center;justify-content:center;padding:1rem;animation:citriFadeIn 0.2s ease;';
                document.body.appendChild(modal);
            }

            const isSuccess = mensaje.includes('✅') || mensaje.includes('✓') || mensaje.includes('éxito') || mensaje.includes('correctamente');
            const isError = mensaje.includes('error') || mensaje.includes('Error') || mensaje.includes('inválid') || mensaje.includes('expirado') || mensaje.includes('incorrect');
            const icon = isSuccess ? 'check_circle' : (isError ? 'error' : 'notifications');
            const iconBg = isSuccess ? '#ecfdf5' : (isError ? '#fef2f2' : '#f0fdf4');
            const iconColor = isSuccess ? '#059669' : (isError ? '#dc2626' : '#1a6b3c');

            modal.innerHTML = `
                <div style="background:#ffffff;border-radius:20px;max-width:440px;width:100%;box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);border:1px solid #e2e8f0;overflow:hidden;transform:scale(0.96);transition:transform 0.2s;animation:citriPopIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;">
                    <div style="padding:1.5rem 1.5rem 1.25rem 1.5rem;display:flex;gap:1rem;align-items:flex-start;">
                        <div style="min-width:44px;height:44px;border-radius:12px;background:${iconBg};display:flex;align-items:center;justify-content:center;color:${iconColor};">
                            <span class="material-symbols-outlined" style="font-size:26px;">${icon}</span>
                        </div>
                        <div style="flex:1;">
                            <div style="font-size:1.05rem;font-weight:800;color:#0d3320;margin-bottom:0.35rem;letter-spacing:-0.2px;">Citri-Fresh</div>
                            <div style="font-size:0.92rem;color:#334155;line-height:1.55;word-break:break-word;">${mensaje}</div>
                        </div>
                    </div>
                    <div style="background:#f8fafc;padding:0.85rem 1.5rem;display:flex;justify-content:flex-end;border-top:1px solid #f1f5f9;">
                        <button id="citri-alert-ok-btn" style="background:#1a6b3c;color:#ffffff;border:none;padding:0.6rem 1.4rem;border-radius:10px;font-weight:700;font-size:0.9rem;cursor:pointer;box-shadow:0 4px 10px rgba(26,107,60,0.25);transition:background 0.2s;">
                            Aceptar
                        </button>
                    </div>
                </div>
            `;
            modal.style.display = 'flex';

            const btn = document.getElementById('citri-alert-ok-btn');
            btn.focus();
            btn.onclick = function() {
                modal.style.display = 'none';
                resolve(true);
            };
        });
    };

    // Reemplazar window.confirm con diálogo modal con diseño Citri-Fresh
    window.confirm = function(mensaje) {
        return new Promise((resolve) => {
            let modal = document.getElementById('citri-custom-confirm-modal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'citri-custom-confirm-modal';
                modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(15,23,42,0.65);backdrop-filter:blur(6px);z-index:999999;display:flex;align-items:center;justify-content:center;padding:1rem;animation:citriFadeIn 0.2s ease;';
                document.body.appendChild(modal);
            }

            modal.innerHTML = `
                <div style="background:#ffffff;border-radius:20px;max-width:440px;width:100%;box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);border:1px solid #e2e8f0;overflow:hidden;animation:citriPopIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;">
                    <div style="padding:1.5rem 1.5rem 1.25rem 1.5rem;display:flex;gap:1rem;align-items:flex-start;">
                        <div style="min-width:44px;height:44px;border-radius:12px;background:#fff7ed;display:flex;align-items:center;justify-content:center;color:#ea580c;">
                            <span class="material-symbols-outlined" style="font-size:26px;">help_outline</span>
                        </div>
                        <div style="flex:1;">
                            <div style="font-size:1.05rem;font-weight:800;color:#0d3320;margin-bottom:0.35rem;letter-spacing:-0.2px;">Citri-Fresh</div>
                            <div style="font-size:0.92rem;color:#334155;line-height:1.55;">${mensaje}</div>
                        </div>
                    </div>
                    <div style="background:#f8fafc;padding:0.85rem 1.5rem;display:flex;justify-content:flex-end;gap:0.75rem;border-top:1px solid #f1f5f9;">
                        <button id="citri-confirm-cancel-btn" style="background:#e2e8f0;color:#334155;border:none;padding:0.6rem 1.2rem;border-radius:10px;font-weight:600;font-size:0.9rem;cursor:pointer;">
                            Cancelar
                        </button>
                        <button id="citri-confirm-ok-btn" style="background:#dc2626;color:#ffffff;border:none;padding:0.6rem 1.3rem;border-radius:10px;font-weight:700;font-size:0.9rem;cursor:pointer;box-shadow:0 4px 10px rgba(220,38,38,0.25);">
                            Confirmar
                        </button>
                    </div>
                </div>
            `;
            modal.style.display = 'flex';

            document.getElementById('citri-confirm-cancel-btn').onclick = function() {
                modal.style.display = 'none';
                resolve(false);
            };
            document.getElementById('citri-confirm-ok-btn').onclick = function() {
                modal.style.display = 'none';
                resolve(true);
            };
        });
    };
})();

// ── Gestor de Sincronización Offline y Resiliencia CitriSync ───────────────
const CitriSync = {
    QUEUE_KEY: 'citrifresh_offline_queue',

    init: function() {
        // 1. Registrar Service Worker si el navegador lo soporta
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then((reg) => console.log('[Citri-Fresh PWA] Service Worker registrado con éxito:', reg.scope))
                    .catch((err) => console.warn('[Citri-Fresh PWA] Fallo al registrar Service Worker:', err));
            });
        }

        // 2. Escuchar cambios de conectividad en tiempo real
        window.addEventListener('online', () => {
            console.log('[CitriSync] Conexión a Internet detectada. Sincronizando cola...');
            this.mostrarAvisoConectividad(true);
            this.sincronizarCola();
        });

        window.addEventListener('offline', () => {
            console.log('[CitriSync] Conexión perdida. Activando modo Offline resiliente.');
            this.mostrarAvisoConectividad(false);
        });

        // Intentar sincronizar si ya estamos online al cargar
        if (navigator.onLine) {
            setTimeout(() => this.sincronizarCola(), 3000);
        }
    },

    getQueue: function() {
        try {
            const q = localStorage.getItem(this.QUEUE_KEY);
            return q ? JSON.parse(q) : [];
        } catch (e) {
            return [];
        }
    },

    addToQueue: function(item) {
        const queue = this.getQueue();
        queue.push({
            id: 'sync_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            tipo: item.tipo, // 'producto' o 'pedido'
            url: item.url,
            metodo: item.metodo || 'POST',
            datos: item.datos,
            fecha: new Date().toISOString()
        });
        localStorage.setItem(this.QUEUE_KEY, JSON.stringify(queue));
    },

    sincronizarCola: async function() {
        if (!navigator.onLine) return;
        const queue = this.getQueue();
        if (queue.length === 0) return;

        console.log(`[CitriSync] Procesando ${queue.length} elementos pendientes...`);
        const pendientes = [];
        let exitosos = 0;

        for (const item of queue) {
            try {
                const res = await fetch(item.url, {
                    method: item.metodo,
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(item.datos)
                });

                if (res.ok) {
                    exitosos++;
                    console.log(`[CitriSync] Elemento sincronizado con éxito (${item.tipo}):`, item.datos.nombre || item.datos);
                } else {
                    // Si hubo error de validación del servidor pero hubo conexión, descartar o reintentar
                    pendientes.push(item);
                }
            } catch (err) {
                // Si volvió a fallar la conexión, conservarlo en cola
                pendientes.push(item);
            }
        }

        localStorage.setItem(this.QUEUE_KEY, JSON.stringify(pendientes));

        if (exitosos > 0) {
            alert(`✅ ¡Conexión restablecida! Se han sincronizado ${exitosos} registro(s) pendiente(s) con la base de datos.`);
            // Si estamos en catálogo o panel, recargar datos frescos
            if (window.location.pathname.includes('producto.html') && typeof cargarCatalogoDesdeBD === 'function') {
                cargarCatalogoDesdeBD();
            }
            if (window.location.pathname.includes('panel_productor.html') && typeof cargarPanelProductor === 'function') {
                cargarPanelProductor();
            }
        }
    },

    mostrarAvisoConectividad: function(isOnline) {
        let banner = document.getElementById('citri-connectivity-banner');
        if (!banner) {
            banner = document.createElement('div');
            banner.id = 'citri-connectivity-banner';
            banner.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:99999;padding:12px 18px;border-radius:12px;font-weight:700;font-size:0.9rem;display:flex;align-items:center;gap:8px;box-shadow:0 10px 25px rgba(0,0,0,0.15);transition:all 0.3s ease;animation:citriFadeIn 0.3s ease;';
            document.body.appendChild(banner);
        }

        if (isOnline) {
            banner.style.background = '#1a6b3c';
            banner.style.color = '#ffffff';
            banner.innerHTML = '<span class="material-symbols-outlined" style="font-size:20px;">wifi</span> En línea: Conexión restablecida';
            setTimeout(() => { banner.style.display = 'none'; }, 4000);
        } else {
            banner.style.background = '#d97706';
            banner.style.color = '#ffffff';
            banner.innerHTML = '<span class="material-symbols-outlined" style="font-size:20px;">wifi_off</span> Modo Sin Conexión: Tus cambios se guardarán localmente';
            banner.style.display = 'flex';
        }
    }
};

// Inicializar sincronización y Service Worker
CitriSync.init();

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
    logout: async function() {
        try {
            await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
        } catch (err) {
            console.warn('Error al llamar /api/auth/logout:', err);
        }
        localStorage.removeItem('citrifresh_user');
        localStorage.removeItem('citrifresh_cart');
        const isInsideAuth = window.location.pathname.includes('/auth/');
        window.location.href = isInsideAuth ? '../inicio.html' : 'inicio.html';
    },
    isLoggedIn: function() {
        return !!this.getUser();
    },
    getRole: function() {
        const user = this.getUser();
        return user ? (user.rol || user.role) : 'guest';
    },
    requireAuth: function(allowedRoles = ['cliente', 'productor', 'admin']) {
        const user = this.getUser();
        if (!user) {
            const isInsidePages = window.location.pathname.includes('/pages/');
            const loginUrl = isInsidePages ? (window.location.pathname.includes('/auth/') ? 'login.html' : 'auth/login.html') : 'pages/auth/login.html';
            window.location.href = loginUrl;
            return false;
        }
        const userRole = user.rol || user.role;
        if (!allowedRoles.includes(userRole)) {
            alert('Acceso restringido para este tipo de cuenta.');
            if (userRole === 'admin' || userRole === 'auditor') {
                window.location.href = 'admin.html';
            } else if (userRole === 'productor') {
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
        const navMenu = document.querySelector('.nav-menu');
        const user = this.getUser();
        const role = user ? (user.rol || user.role) : 'guest';
        const isAuthPage = window.location.pathname.includes('/auth/');
        const prefix = isAuthPage ? '../' : '';
        const currentPath = window.location.pathname;

        // 1. Sincronizar el Menú Principal (.nav-menu) para que NUNCA desaparezca ninguna pestaña según el rol
        if (navMenu) {
            let roleLinks = '';
            if (role === 'cliente') {
                const isPerfilActive = currentPath.includes('perfil.html') ? 'active' : '';
                roleLinks = `<a class="nav-link ${isPerfilActive}" href="${prefix}perfil.html">Mi Panel</a>`;
            } else if (role === 'productor') {
                const isPanelActive = currentPath.includes('panel_productor.html') ? 'active' : '';
                roleLinks = `<a class="nav-link ${isPanelActive}" href="${prefix}panel_productor.html">Panel Productor</a>`;
            } else if (role === 'admin' || role === 'auditor') {
                const isAdminActive = currentPath.includes('admin.html') ? 'active' : '';
                const tabTitle = role === 'auditor' ? 'Auditoría' : 'Panel Admin';
                roleLinks = `<a class="nav-link ${isAdminActive}" href="${prefix}admin.html">${tabTitle}</a>`;
            }

            const isInicioActive = (currentPath.includes('inicio.html') || currentPath.endsWith('/')) ? 'active' : '';
            const isProdActive = currentPath.includes('producto.html') ? 'active' : '';
            const isNosotrosActive = currentPath.includes('nosotros.html') ? 'active' : '';

            navMenu.innerHTML = `
                <a class="nav-link ${isInicioActive}" href="${prefix}inicio.html">Inicio</a>
                <a class="nav-link ${isProdActive}" href="${prefix}producto.html">Productos</a>
                ${roleLinks}
                <a class="nav-link ${isNosotrosActive}" href="${prefix}nosotros.html">Nosotros</a>
            `;
        }

        // 2. Sincronizar Acciones de Barra (.nav-actions)
        if (navActions) {
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
                const userName = user.nombre || user.name || 'Cliente';
                navActions.innerHTML = `
                    <a href="${prefix}carrito.html" class="btn btn-icon text-primary" title="Carrito de Compras" style="position: relative;">
                        <span class="material-symbols-outlined" style="font-size: 26px;">shopping_cart</span>
                        <span class="cart-count-badge" style="position: absolute; top: 0; right: 0; background: var(--color-accent); color: white; border-radius: 50%; font-size: 11px; font-weight: 700; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center;">0</span>
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
            // Si es Productor -> Panel Productor y Subir Cosecha
            else if (role === 'productor') {
                const userName = user.nombre || user.name || 'Productor';
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
            // Si es Administrador -> Acceso a Panel Maestro
            else if (role === 'admin') {
                const userName = user.nombre || user.name || 'Administrador';
                navActions.innerHTML = `
                    <a href="${prefix}admin.html" class="btn btn-primary hidden md-flex items-center gap-xs" style="font-size: 0.8125rem; padding: 0.5rem 1rem;">
                        <span class="material-symbols-outlined" style="font-size: 18px;">admin_panel_settings</span>
                        <span>${userName}</span>
                    </a>
                    <button onclick="CitriAuth.logout()" class="btn btn-icon text-muted hover:text-primary" title="Cerrar Sesión">
                        <span class="material-symbols-outlined">logout</span>
                    </button>
                    <button class="mobile-menu-btn" aria-label="Abrir Menú">
                        <span class="material-symbols-outlined">menu</span>
                    </button>
                `;
            }
            // Si es Auditor -> Acceso a Modo Auditoría
            else if (role === 'auditor') {
                const userName = user.nombre || user.name || 'Auditor General';
                navActions.innerHTML = `
                    <a href="${prefix}admin.html" class="hidden md-flex items-center gap-xs" style="font-size: 0.8125rem; padding: 0.5rem 1rem; border-radius: 9999px; background: #0f766e; color: white; text-decoration: none; font-weight: 700;">
                        <span class="material-symbols-outlined" style="font-size: 18px;">policy</span>
                        <span>Auditoría: ${userName}</span>
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
    }
};

// ==================== GESTOR DEL CARRITO DE COMPRAS (CitriCart) ====================
const CitriCart = {
    STORAGE_KEY: 'citrifresh_cart',

    getItems: function() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Error leyendo carrito:', e);
            return [];
        }
    },

    saveItems: function(items) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
        this.updateCartBadge();
        window.dispatchEvent(new CustomEvent('citri:cart-updated', { detail: { items } }));
    },

    addItem: function(producto) {
        const items = this.getItems();
        const prodId = Number(producto.id);
        const existing = items.find(item => Number(item.id) === prodId);

        if (existing) {
            existing.cantidad = (Number(existing.cantidad) || 1) + (Number(producto.cantidad) || 1);
        } else {
            items.push({
                id: prodId,
                nombre: producto.nombre || 'Producto Cítrico',
                precio: Number(producto.precio) || 0,
                unidad: producto.unidad || 'caja',
                imagen: producto.imagen || '/public/images/n-comer.jpg',
                productor: producto.productor || 'Finca Cítrica',
                cantidad: Number(producto.cantidad) || 1
            });
        }

        this.saveItems(items);
        return this.getItems();
    },

    updateQuantity: function(id, cantidad) {
        let items = this.getItems();
        const qty = parseInt(cantidad, 10);
        const prodId = Number(id);

        if (qty <= 0) {
            items = items.filter(item => Number(item.id) !== prodId);
        } else {
            const item = items.find(item => Number(item.id) === prodId);
            if (item) item.cantidad = qty;
        }

        this.saveItems(items);
        return items;
    },

    removeItem: function(id) {
        const prodId = Number(id);
        const items = this.getItems().filter(item => Number(item.id) !== prodId);
        this.saveItems(items);
        return items;
    },

    clear: function() {
        localStorage.removeItem(this.STORAGE_KEY);
        this.updateCartBadge();
        window.dispatchEvent(new CustomEvent('citri:cart-updated', { detail: { items: [] } }));
    },

    getCount: function() {
        const items = this.getItems();
        return items.reduce((acc, item) => acc + (Number(item.cantidad) || 0), 0);
    },

    getTotals: function() {
        const items = this.getItems();
        const subtotal = items.reduce((acc, item) => acc + (Number(item.precio) * Number(item.cantidad)), 0);
        // Exención agropecuaria según Ley de Concertación Tributaria (productos primarios en estado natural) o tarifa preferencial
        const envio = items.length > 0 ? 150 : 0; // C$ 150 tarifa plana nacional
        const total = subtotal + envio;

        return {
            subtotal,
            envio,
            total,
            totalItems: this.getCount()
        };
    },

    updateCartBadge: function() {
        const count = this.getCount();
        document.querySelectorAll('.cart-count-badge').forEach(badge => {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        });
    }
};

// ==================== INICIALIZACIÓN DE LA PÁGINA ====================
document.addEventListener('DOMContentLoaded', function () {
    // 1. Inicializar barra de navegación según sesión
    CitriAuth.updateNavUI();

    // 2. Control del Formulario de Inicio de Sesión (Login real contra Backend)
    const loginForm = document.querySelector('.auth-form');
    if (loginForm && (window.location.pathname.includes('/auth/login.html') || loginForm.id === 'login-form')) {
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
                CitriAuth.setUser(data.user);

                // Redirigir según el rol retornado por la base de datos
                if (data.user.rol === 'admin' || data.user.rol === 'auditor') {
                    window.location.href = '../admin.html';
                } else if (data.user.rol === 'productor') {
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

    // 3. Control del Formulario de Registro (Registro real en BD SQLite)
    const registerForm = document.querySelector('.auth-form');
    if (registerForm && window.location.pathname.includes('registro.html')) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const roleSelected = registerForm.querySelector('input[name="role"]:checked')?.value || 'cliente';
            const nameInputs = registerForm.querySelectorAll('input[placeholder="Carlos"], input[placeholder="Mendoza"]');
            const emailInput = registerForm.querySelector('input[type="email"]');
            const passwordInput = registerForm.querySelector('input[type="password"]');
            const submitBtn = registerForm.querySelector('button[type="submit"]');

            const nombre = nameInputs.length >= 2 
                ? `${nameInputs[0].value.trim()} ${nameInputs[1].value.trim()}`.trim()
                : (nameInputs[0]?.value.trim() || 'Usuario');
            const email = emailInput ? emailInput.value.trim() : '';
            const password = passwordInput ? passwordInput.value : '';

            if (!nombre || !email || !password) {
                alert('Por favor completa todos los campos.');
                return;
            }

            if (password.length < 6) {
                alert('La contraseña debe tener al menos 6 caracteres.');
                return;
            }

            const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span>Registrando...</span>';
            }

            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ nombre, email, password, rol: roleSelected })
                });

                const data = await response.json();

                if (!response.ok) {
                    alert(data.error || 'Error al registrar la cuenta.');
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnHtml;
                    }
                    return;
                }

                // Iniciar sesión automáticamente tras registro
                CitriAuth.setUser(data.user);

                if (data.user.rol === 'admin') {
                    window.location.href = 'admin.html';
                } else if (data.user.rol === 'productor') {
                    window.location.href = 'panel_productor.html';
                } else {
                    window.location.href = 'perfil.html';
                }
            } catch (error) {
                console.error('Error al registrarse:', error);
                alert('No se pudo conectar con el servidor.');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnHtml;
                }
            }
        });
    }

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

// ==================== FUNCIONES DINÁMICAS DE VISTAS ====================

// 1. Cálculo Automático de Temporada y Cosecha Agrícola en Nicaragua
function calcularCosechaAutomatica() {
    const badge = document.getElementById('badge-cosecha-disponible');
    if (!badge) return;

    const ahora = new Date();
    const mes = ahora.getMonth(); // 0 = Enero, 11 = Diciembre
    const anio = ahora.getFullYear();

    // Calendario Citrícola Nicaragüense (Ciclos del Pacífico: Rivas, Masaya, Carazo, Chinandega, León):
    // - Octubre a Febrero (meses 9, 10, 11, 0, 1): Cosecha Mayor / Pico Principal de Naranja y Mandarina
    // - Marzo a Mayo (meses 2, 3, 4): Zafra de Verano / Época Seca y Riego (Limón y Naranja Agria)
    // - Junio a Septiembre (meses 5, 6, 7, 8): Cosecha de Invierno / San Juan y Floraciones Tardías
    let temporadaNombre = '';
    let anioCosecha = anio;

    if (mes >= 9 || mes <= 1) {
        // Ejemplo: Nov 2026 -> Cosecha 2026-2027
        const siguienteAnio = (mes >= 9) ? anio + 1 : anio;
        const primerAnio = (mes >= 9) ? anio : anio - 1;
        temporadaNombre = `COSECHA PRINCIPAL ${primerAnio}-${siguienteAnio} DISPONIBLE`;
    } else if (mes >= 2 && mes <= 4) {
        temporadaNombre = `COSECHA DE VERANO ${anioCosecha} DISPONIBLE`;
    } else {
        temporadaNombre = `COSECHA DE INVIERNO ${anioCosecha} DISPONIBLE`;
    }

    badge.textContent = temporadaNombre;
}

// Perfil de Usuario
async function cargarPerfilUsuario() {
    const user = CitriAuth.getUser();
    if (!user) return;

    const fullName = user.nombre || user.name || 'Usuario Citri-Fresh';
    const firstName = fullName.split(' ')[0];

    const greetingEl = document.getElementById('greeting-name');
    const nameEl = document.getElementById('profile-name');
    const roleEl = document.getElementById('profile-role');
    const emailEl = document.getElementById('profile-email');
    const phoneEl = document.getElementById('profile-phone');
    const addressEl = document.getElementById('profile-address');
    const avatarImg = document.getElementById('profile-avatar-img');
    const avatarIcon = document.getElementById('profile-avatar-icon');

    if (greetingEl) greetingEl.textContent = firstName;
    if (nameEl) nameEl.textContent = fullName;
    if (emailEl) emailEl.textContent = user.email || '';
    if (phoneEl) phoneEl.textContent = user.telefono || 'Sin teléfono registrado';
    if (addressEl) addressEl.textContent = user.direccion || 'Sin dirección registrada';

    if (avatarImg && avatarIcon) {
        if (user.foto) {
            avatarImg.src = user.foto;
            avatarImg.style.display = 'block';
            avatarIcon.style.display = 'none';
        } else {
            avatarImg.style.display = 'none';
            avatarIcon.style.display = 'block';
        }
    }

    if (roleEl) {
        const rol = user.rol || user.role;
        roleEl.textContent = rol === 'admin' ? 'Administrador del Sistema' : (rol === 'productor' ? 'Productor Citrícola' : 'Cliente Comprador');
    }

    // Cargar pedidos reales del usuario desde el Backend
    try {
        const res = await fetch('/api/pedidos', { credentials: 'include' });
        if (res.ok) {
            const pedidos = await res.json();
            window.clientePedidos = pedidos;
            if (typeof clientePedidos !== 'undefined') {
                clientePedidos = pedidos;
            }

            // Actualizar tarjetas estadísticas de pedidos del cliente
            const statPendientes = document.getElementById('stat-pedidos-pendientes');
            const statEnviados = document.getElementById('stat-pedidos-enviados');
            const statEntregados = document.getElementById('stat-pedidos-entregados');

            if (statPendientes) {
                statPendientes.textContent = pedidos.filter(p => p.estado === 'pendiente').length;
            }
            if (statEnviados) {
                statEnviados.textContent = pedidos.filter(p => p.estado === 'enviado').length;
            }
            if (statEntregados) {
                statEntregados.textContent = pedidos.filter(p => p.estado === 'completado' || p.estado === 'entregado').length;
            }

            const tbody = document.getElementById('pedidos-tbody');
            if (tbody) {
                if (pedidos.length === 0) {
                    tbody.innerHTML = `
                        <tr>
                            <td colspan="6" style="text-align: center; padding: 2.5rem; color: #888;">
                                <span class="material-symbols-outlined" style="font-size: 36px; display: block; margin-bottom: 8px; color: var(--color-primary);">shopping_basket</span>
                                No tienes pedidos registrados todavía. <a href="producto.html" style="color: var(--color-primary); font-weight: 700;">¡Explora las cosechas disponibles!</a>
                            </td>
                        </tr>
                    `;
                } else {
                    tbody.innerHTML = pedidos.map(p => {
                        const fecha = p.creado_en || p.fecha ? new Date(p.creado_en || p.fecha).toLocaleDateString('es-NI', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Reciente';
                        const itemsText = p.items && p.items.length > 0 
                            ? p.items.map(i => `${i.producto_nombre} (x${i.cantidad})`).join(', ')
                            : (p.total_items ? `${p.total_items} producto(s) cítricos` : 'Cítricos seleccionados');
                        const estadoBadge = (p.estado === 'entregado' || p.estado === 'completado')
                            ? '<span class="badge badge-success">Entregado</span>'
                            : (p.estado === 'enviado' 
                                ? '<span class="badge" style="background-color: var(--color-surface-container); color: var(--color-primary);">Enviado</span>'
                                : '<span class="badge" style="background-color: rgba(255,199,59,0.2); color: var(--color-text-dark);">Pendiente</span>');

                        return `
                            <tr>
                                <td style="font-weight: 700;">#CF-${p.id}</td>
                                <td class="text-muted">${fecha}</td>
                                <td class="text-muted" style="max-width: 220px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${itemsText}">
                                    ${itemsText}
                                </td>
                                <td class="text-primary" style="font-weight: 700;">C$ ${Number(p.total).toFixed(2)}</td>
                                <td>${estadoBadge}</td>
                                <td style="text-align: center;">
                                    <button onclick="verDetallePedidoCliente(${p.id})" class="btn btn-icon text-muted hover:text-primary" title="Ver Detalle">
                                        <span class="material-symbols-outlined">visibility</span>
                                    </button>
                                </td>
                            </tr>
                        `;
                    }).join('');
                }
            }
        }
    } catch (err) {
        console.warn('No se pudieron cargar los pedidos:', err);
    }
}

// Panel del Productor: Estadísticas reales, gestión de inventario y acciones de pedidos
async function cargarPanelProductor() {
    const user = CitriAuth.getUser();
    if (!user) return;

    // Actualizar nombre y finca en el encabezado
    const fincaEl = document.getElementById('productor-finca-nombre');
    if (fincaEl) {
        fincaEl.textContent = `Bienvenido ${user.nombre || 'Productor'} • Finca Cítricos San Carlos (Rivas / Masaya)`;
    }

    try {
        // 1. Cargar productos del productor desde la BD
        const resProd = await fetch(`/api/productos?productor_id=${user.id}`, { credentials: 'include' });
        let productos = [];
        if (resProd.ok) {
            productos = await resProd.json();
            window.productorProductos = productos;

            // Calcular Stock Crítico (< 50 unidades)
            const stockCritico = productos.filter(p => Number(p.stock) < 50);
            const statStock = document.getElementById('stat-stock-critico');
            const statStockSub = document.getElementById('stat-stock-subtext');
            if (statStock) {
                statStock.innerHTML = `${stockCritico.length} <span class="text-muted" style="font-size: var(--text-body-md); font-weight: 400;">Lotes</span>`;
            }
            if (statStockSub) {
                if (stockCritico.length > 0) {
                    statStockSub.innerHTML = `<span class="material-symbols-outlined" style="font-size: 16px; color: var(--color-error);">warning</span> ${stockCritico.length} lote(s) requiere reabastecimiento`;
                    statStockSub.style.color = 'var(--color-error)';
                } else {
                    statStockSub.innerHTML = `<span class="material-symbols-outlined" style="font-size: 16px; color: var(--color-secondary);">check_circle</span> Inventario al día`;
                    statStockSub.style.color = 'var(--color-secondary)';
                }
            }

            // Renderizar lista de inventario
            const invContainer = document.getElementById('productor-inventario-list');
            if (invContainer) {
                if (productos.length === 0) {
                    invContainer.innerHTML = `
                        <div style="text-align: center; padding: 2rem; color: #888;">
                            <span class="material-symbols-outlined" style="font-size: 40px; color: var(--color-primary-container);">eco</span>
                            <p style="margin-top: 0.5rem;">Aún no has registrado cosechas.</p>
                            <a href="registro_cosecha.html" class="btn btn-primary btn-sm" style="margin-top: 0.5rem; display: inline-block;">Subir Primera Cosecha</a>
                        </div>
                    `;
                } else {
                    invContainer.innerHTML = productos.map(p => `
                        <div style="display: flex; align-items: center; justify-content: space-between; padding: var(--space-md); border: 1px solid var(--color-border); border-radius: var(--radius-lg); background-color: white;">
                            <div class="flex items-center gap-md" style="flex: 1; min-width: 0;">
                                <img alt="${p.nombre}" src="${p.imagen || '/public/images/l-criollo.jpg'}" style="width: 48px; height: 48px; border-radius: var(--radius-md); object-fit: cover; flex-shrink: 0;">
                                <div style="min-width: 0;">
                                    <h3 style="margin: 0; font-size: var(--text-label); font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.nombre}</h3>
                                    <p class="text-muted" style="margin: 0; font-size: var(--text-caption);">C$ ${Number(p.precio).toFixed(2)} / ${p.unidad} • Zona: ${p.zona_nombre || 'Nicaragua'}</p>
                                </div>
                            </div>
                            <div style="text-align: right; margin: 0 1rem; flex-shrink: 0;">
                                <div class="text-primary" style="font-weight: 700; font-size: var(--text-label);">${p.stock} ${p.unidad}s</div>
                                <div class="badge ${Number(p.stock) < 50 ? 'badge-error' : 'badge-success'}" style="margin-top: 4px;">
                                    ${Number(p.stock) < 50 ? 'Stock Bajo' : 'En Stock'}
                                </div>
                            </div>
                            <div class="flex items-center gap-xs" style="flex-shrink: 0;">
                                <button onclick="abrirModalEditarProducto(${p.id})" class="btn btn-icon text-muted hover:text-primary" title="Editar Lote">
                                    <span class="material-symbols-outlined">edit</span>
                                </button>
                                <button onclick="eliminarProductoProductor(${p.id})" class="btn btn-icon text-muted hover:text-error" title="Eliminar Lote">
                                    <span class="material-symbols-outlined" style="color: var(--color-error);">delete</span>
                                </button>
                            </div>
                        </div>
                    `).join('');
                }
            }
        }

        // 2. Cargar pedidos del productor desde la BD (/api/pedidos)
        const resPed = await fetch('/api/pedidos', { credentials: 'include' });
        if (resPed.ok) {
            const pedidos = await resPed.json();
            window.productorPedidos = pedidos;

            // Calcular Ventas Mensuales acumuladas y Pedidos Activos
            const pedidosActivos = pedidos.filter(p => p.estado === 'pendiente' || p.estado === 'enviado');
            const pedidosPendientes = pedidos.filter(p => p.estado === 'pendiente');
            const totalVentas = pedidos
                .filter(p => p.estado !== 'cancelado')
                .reduce((sum, p) => sum + (Number(p.total) || 0), 0);

            const statVentas = document.getElementById('stat-ventas-productor');
            const statActivos = document.getElementById('stat-pedidos-activos');
            const statPendientesEl = document.getElementById('stat-pedidos-pendientes');

            if (statVentas) {
                statVentas.textContent = `C$ ${totalVentas.toLocaleString('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            }
            if (statActivos) {
                statActivos.textContent = pedidosActivos.length;
            }
            if (statPendientesEl) {
                statPendientesEl.textContent = `${pedidosPendientes.length} pendientes de despacho`;
            }

            // Renderizar tabla de pedidos del productor
            const tbody = document.getElementById('productor-pedidos-tbody');
            if (tbody) {
                if (pedidos.length === 0) {
                    tbody.innerHTML = `
                        <tr>
                            <td colspan="6" style="text-align: center; padding: 2.5rem; color: #888;">
                                <span class="material-symbols-outlined" style="font-size: 36px; color: var(--color-primary-container);">inbox</span>
                                <p style="margin-top: 0.5rem;">No tienes pedidos recibidos todavía.</p>
                            </td>
                        </tr>
                    `;
                } else {
                    tbody.innerHTML = pedidos.map(p => {
                        const fecha = p.fecha ? new Date(p.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Reciente';
                        let estadoBadge = '';
                        if (p.estado === 'completado' || p.estado === 'entregado') {
                            estadoBadge = '<span class="badge badge-success">Entregado</span>';
                        } else if (p.estado === 'enviado') {
                            estadoBadge = '<span class="badge" style="background-color: var(--color-surface-container); color: var(--color-primary);">Enviado</span>';
                        } else if (p.estado === 'cancelado') {
                            estadoBadge = '<span class="badge badge-error">Rechazado</span>';
                        } else {
                            estadoBadge = '<span class="badge" style="background-color: rgba(255,199,59,0.2); color: var(--color-text-dark);">Pendiente</span>';
                        }

                        // Botones de acción para el productor
                        let accionesHtml = '';
                        if (p.estado === 'pendiente') {
                            accionesHtml = `
                                <div class="flex items-center justify-center gap-xs">
                                    <button onclick="cambiarEstadoPedidoProductor(${p.id}, 'enviado')" class="btn btn-sm btn-primary" title="Aceptar y Despachar" style="padding: 0.25rem 0.6rem; font-size: 0.75rem;">
                                        <span class="material-symbols-outlined" style="font-size: 15px;">local_shipping</span> Despachar
                                    </button>
                                    <button onclick="cambiarEstadoPedidoProductor(${p.id}, 'cancelado')" class="btn btn-sm" title="Rechazar Pedido" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; background: rgba(186,26,26,0.1); color: var(--color-error); border: none;">
                                        <span class="material-symbols-outlined" style="font-size: 15px;">close</span>
                                    </button>
                                </div>
                            `;
                        } else if (p.estado === 'enviado') {
                            accionesHtml = `
                                <button onclick="cambiarEstadoPedidoProductor(${p.id}, 'completado')" class="btn btn-sm btn-accent" title="Marcar como Entregado" style="padding: 0.25rem 0.6rem; font-size: 0.75rem;">
                                    <span class="material-symbols-outlined" style="font-size: 15px;">done_all</span> Marcar Entregado
                                </button>
                            `;
                        } else {
                            accionesHtml = `<span class="text-muted" style="font-size: var(--text-caption);">Finalizado</span>`;
                        }

                        return `
                            <tr>
                                <td style="font-weight: 700;">#CF-${p.id}</td>
                                <td>
                                    <div style="font-weight: 600;">${p.cliente_nombre || 'Cliente Registrado'}</div>
                                    <div class="text-muted" style="font-size: var(--text-caption);">${p.cliente_email || ''}</div>
                                </td>
                                <td class="text-muted">${fecha}</td>
                                <td>${estadoBadge}</td>
                                <td class="text-primary" style="font-weight: 700; text-align: right;">C$ ${Number(p.total).toFixed(2)}</td>
                                <td style="text-align: center;">${accionesHtml}</td>
                            </tr>
                        `;
                    }).join('');
                }
            }
        }

        // 3. Inicializar modal de edición de lote
        inicializarModalEditarProducto();

    } catch (err) {
        console.warn('Error al cargar panel del productor:', err);
    }
}

// Acción del Productor: Cambiar estado de un pedido (Aceptar/Enviar o Rechazar/Cancelar)
async function cambiarEstadoPedidoProductor(pedidoId, nuevoEstado) {
    const accionTexto = nuevoEstado === 'enviado' ? 'despachar' : (nuevoEstado === 'cancelado' ? 'rechazar' : 'completar');
    if (!confirm(`¿Estás seguro de que deseas ${accionTexto} el pedido #CF-${pedidoId}?`)) return;

    try {
        const res = await fetch(`/api/pedidos/${pedidoId}/estado`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ estado: nuevoEstado })
        });

        const data = await res.json();
        if (!res.ok) {
            alert(data.error || 'No se pudo actualizar el estado del pedido.');
            return;
        }

        // Recargar datos actualizados en el panel
        cargarPanelProductor();
    } catch (err) {
        console.error('Error al actualizar pedido:', err);
        alert('Ocurrió un error al contactar el servidor.');
    }
}

// Acción del Productor: Eliminar producto
async function eliminarProductoProductor(productoId) {
    if (!confirm('¿Estás seguro de que deseas eliminar este lote de tu inventario? Esta acción no se puede deshacer.')) return;

    try {
        const res = await fetch(`/api/productos/${productoId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        const data = await res.json();
        if (!res.ok) {
            alert(data.error || 'No se pudo eliminar el lote.');
            return;
        }

        // Recargar inventario y estadísticas
        cargarPanelProductor();
    } catch (err) {
        console.error('Error al eliminar producto:', err);
        alert('Ocurrió un error al contactar el servidor.');
    }
}

// Modal Editar Producto
function abrirModalEditarProducto(productoId) {
    const modal = document.getElementById('modal-editar-producto');
    if (!modal || !window.productorProductos) return;

    const prod = window.productorProductos.find(p => p.id === productoId);
    if (!prod) return;

    document.getElementById('edit-prod-id').value = prod.id;
    document.getElementById('edit-prod-nombre').value = prod.nombre;
    document.getElementById('edit-prod-precio').value = prod.precio;
    document.getElementById('edit-prod-stock').value = prod.stock;

    modal.style.display = 'flex';
}

function inicializarModalEditarProducto() {
    const modal = document.getElementById('modal-editar-producto');
    if (!modal || modal.dataset.init === 'true') return;
    modal.dataset.init = 'true';

    const btnCerrar = document.getElementById('btn-cerrar-modal-prod');
    const btnCancelar = document.getElementById('btn-cancelar-modal-prod');
    const form = document.getElementById('form-editar-producto');

    const cerrar = () => modal.style.display = 'none';
    if (btnCerrar) btnCerrar.onclick = cerrar;
    if (btnCancelar) btnCancelar.onclick = cerrar;
    modal.onclick = (e) => { if (e.target === modal) cerrar(); };

    if (form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            const id = document.getElementById('edit-prod-id').value;
            const nombre = document.getElementById('edit-prod-nombre').value.trim();
            const precio = parseFloat(document.getElementById('edit-prod-precio').value);
            const stock = parseInt(document.getElementById('edit-prod-stock').value, 10);

            try {
                const res = await fetch(`/api/productos/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ nombre, precio, stock })
                });

                const data = await res.json();
                if (!res.ok) {
                    alert(data.error || 'No se pudo actualizar el producto.');
                    return;
                }

                cerrar();
                cargarPanelProductor();
            } catch (err) {
                console.error('Error al actualizar producto:', err);
                alert('Ocurrió un error al contactar el servidor.');
            }
        };
    }
}

// Catálogo de Productos
async function cargarCatalogoDesdeBD() {
    const grid = document.getElementById('catalog-products-grid');
    if (!grid) return;

    try {
        const res = await fetch('/api/productos');
        if (!res.ok) return;

        const productos = await res.json();
        if (productos.length === 0) return;

        // Renderizar productos reales de la base de datos
        grid.innerHTML = productos.map(p => {
            const categoria = p.nombre.toLowerCase().includes('naranja') ? 'naranjas' 
                : (p.nombre.toLowerCase().includes('limón') || p.nombre.toLowerCase().includes('limon') ? 'limones' : 'mandarinas');
            const fallbackImg = categoria === 'limones' ? '/public/images/l-criollo.jpg' 
                : (categoria === 'mandarinas' ? '/public/images/mandarina.jpeg' : '/public/images/n-comer.jpg');
            const imagen = p.imagen || fallbackImg;

            return `
                <div class="product-card" data-category="${categoria}">
                    <div class="product-image-container">
                        <img src="${imagen}" alt="${p.nombre}" class="product-image" style="object-position: center;">
                        <div class="product-badges">
                            <span class="badge badge-success">${p.zona_nombre || 'Nicaragua'}</span>
                        </div>
                    </div>
                    <div class="product-info">
                        <span class="product-category">${categoria.toUpperCase()}</span>
                        <h2 class="product-name">${p.nombre}</h2>
                        <div class="product-seller">
                            <span class="material-symbols-outlined" style="font-size: 16px;">storefront</span>
                            ${p.productor_nombre || 'Finca Productora'}
                        </div>
                        
                        <div class="product-price-row">
                            <div class="product-price">C$ ${Number(p.precio).toFixed(0)} <span class="product-unit">/ ${p.unidad}</span></div>
                        </div>
                        
                        <div class="product-actions">
                            <a href="detalle_producto.html?id=${p.id}" class="btn-details" title="Ver Detalles">
                                <span class="material-symbols-outlined">visibility</span>
                            </a>
                            <button class="btn-cart" data-id="${p.id}" data-name="${p.nombre}" data-price="${p.precio}">
                                <span class="material-symbols-outlined">shopping_cart</span> Agregar
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Re-adjuntar eventos de los botones de carrito para los elementos renderizados
        grid.querySelectorAll('.btn-cart').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                gestionarClickAgregarCarrito(this);
            });
        });

        // Disparar evento para que los filtros de producto.html se sincronicen con las tarjetas cargadas dinámicamente
        window.dispatchEvent(new CustomEvent('citri:catalog-loaded'));

    } catch (err) {
        console.warn('No se pudo cargar productos del servidor:', err);
    }
}

// Función compartida y blindada para agregar al carrito
function gestionarClickAgregarCarrito(btn) {
    const user = CitriAuth.getUser();
    if (!user) {
        window.location.href = 'auth/login.html';
        return;
    }
    const role = user.rol || user.role;
    if (role === 'productor') {
        alert('Las cuentas de Productor no compran en el catálogo. Tu perfil gestiona y publica cosechas.');
        return;
    }

    const id = btn.dataset.id;
    const name = btn.dataset.name || 'Producto Cítrico';
    const price = parseFloat(btn.dataset.price) || 0;
    const card = btn.closest('.product-card');
    const img = card ? card.querySelector('.product-image')?.getAttribute('src') : '/public/images/n-comer.jpg';
    const unitText = card ? card.querySelector('.product-unit')?.textContent.replace('/', '').trim() : 'caja';

    CitriCart.addItem({
        id,
        nombre: name,
        precio: price,
        unidad: unitText,
        imagen: img,
        cantidad: 1
    });

    // Guardar estado visual "Agregado"
    btn.classList.add('added-state');
    btn.style.setProperty('background', '#16a34a', 'important');
    btn.style.setProperty('color', '#ffffff', 'important');
    btn.innerHTML = '<span class="material-symbols-outlined" style="font-size: 18px;">check_circle</span> ¡Agregado!';

    setTimeout(() => {
        btn.innerHTML = '<span class="material-symbols-outlined" style="font-size: 18px;">add_shopping_cart</span> Agregar (+1)';
        btn.style.removeProperty('background');
        btn.style.removeProperty('color');
        btn.classList.remove('added-state');
    }, 2000);
}

// Formulario de Nueva Cosecha
function inicializarFormularioCosecha() {
    const form = document.querySelector('.form-grid');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const user = CitriAuth.getUser();
        if (!user || (user.rol !== 'productor' && user.rol !== 'admin')) {
            alert('Debes iniciar sesión con una cuenta de Productor para publicar cosechas.');
            window.location.href = 'auth/login.html';
            return;
        }

        const nombre = document.getElementById('product_name')?.value.trim();
        const descripcion = document.getElementById('description')?.value.trim() || '';
        const precio = parseFloat(document.getElementById('price')?.value);
        const unidad = document.getElementById('unit')?.value || 'caja';
        const stock = parseInt(document.getElementById('stock')?.value, 10);
        const zoneSelect = document.getElementById('zone')?.value;

        // Mapeo de zona a ID en base de datos
        const zoneMap = { 'leon': 1, 'chinandega': 2, 'carazo': 3, 'rivas': 4, 'masaya': 5 };
        const zonaId = zoneMap[zoneSelect] || 1;

        const fileInput = document.getElementById('cosecha_img');
        let imagenBase64 = '';

        if (fileInput && fileInput.files && fileInput.files[0]) {
            const file = fileInput.files[0];
            imagenBase64 = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.onerror = () => resolve('');
                reader.readAsDataURL(file);
            });
        } else if (typeof currentImageBase64 !== 'undefined' && currentImageBase64) {
            imagenBase64 = currentImageBase64;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="material-symbols-outlined">hourglass_top</span> Publicando...';
        }

        const productoPayload = {
            nombre,
            descripcion,
            precio,
            unidad,
            stock,
            zona: zonaId,
            imagen: imagenBase64
        };

        try {
            const res = await fetch('/api/productos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(productoPayload)
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.error || 'Error al publicar la cosecha');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<span class="material-symbols-outlined">save</span> Publicar Producto';
                }
                return;
            }

            localStorage.removeItem('citrifresh_borrador_cosecha');
            alert(`🍊 ¡Cosecha "${nombre}" guardada en la base de datos y publicada exitosamente!`);
            window.location.href = 'panel_productor.html';
        } catch (err) {
            console.warn('Conexión no disponible. Encolando cosecha para sincronización posterior:', err);
            CitriSync.addToQueue({
                tipo: 'producto',
                url: '/api/productos',
                metodo: 'POST',
                datos: productoPayload
            });
            localStorage.removeItem('citrifresh_borrador_cosecha');
            alert(`💾 ¡Cosecha "${nombre}" guardada sin conexión!\nSe sincronizará automáticamente con el servidor en cuanto regrese el internet.`);
            window.location.href = 'panel_productor.html';
        }
    });
}

// ==================== GOOGLE SIGN-IN / REGISTER CON INTERFAZ AUTÉNTICA DE GOOGLE ====================
function inicializarBotonGoogle() {
    // 1. Inyectar la biblioteca oficial de Google Identity Services si no está presente
    if (!document.getElementById('google-gsi-client')) {
        const script = document.createElement('script');
        script.id = 'google-gsi-client';
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
    }

    const googleBtns = document.querySelectorAll('.btn-social-google');
    if (!googleBtns.length) return;

    googleBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            abrirInterfazAutenticaGoogle();
        });
    });
}

/**
 * Abre la interfaz real y oficial de autenticación de cuentas de Google (Google Accounts OAuth 2.0).
 * Si la librería GSI de Google está cargada, inicia el flujo nativo TokenClient de Google Identity.
 * De forma paralela y robusta, abre la ventana emergente estándar de Google OAuth 2.0.
 */
function abrirInterfazAutenticaGoogle() {
    const isInsideAuth = window.location.pathname.includes('/auth/');
    const redirectPrefix = isInsideAuth ? '../' : '';

    const GOOGLE_CLIENT_ID = '1096747808728-qs9egmbcrfuam09vvu3d36140f5mqr3c.apps.googleusercontent.com';

    // Intentar con Google Identity Services token client si está disponible
    if (window.google && window.google.accounts && window.google.accounts.oauth2) {
        try {
            const tokenClient = window.google.accounts.oauth2.initTokenClient({
                client_id: GOOGLE_CLIENT_ID,
                scope: 'email profile openid',
                prompt: 'select_account',
                callback: async (tokenResponse) => {
                    if (tokenResponse && tokenResponse.access_token) {
                        await procesarTokenGoogle(tokenResponse.access_token, redirectPrefix);
                    }
                }
            });
            tokenClient.requestAccessToken();
            return;
        } catch (e) {
            console.warn('GSI initTokenClient fallback:', e);
        }
    }

    // Flujo oficial directo de Google Accounts OAuth Popup
    const width = 500;
    const height = 620;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${encodeURIComponent(GOOGLE_CLIENT_ID)}` +
        `&redirect_uri=${encodeURIComponent(window.location.origin + '/api/auth/google-callback')}` +
        `&response_type=token%20id_token` +
        `&scope=${encodeURIComponent('openid email profile')}` +
        `&prompt=select_account` +
        `&nonce=${Date.now()}`;

    const googlePopup = window.open(
        googleOAuthUrl,
        'GoogleSignInWindow',
        `width=${width},height=${height},left=${left},top=${top},status=0,toolbar=0,menubar=0,location=1`
    );

    const onGoogleMessage = async (event) => {
        if (event.data && event.data.type === 'GOOGLE_AUTH_SUCCESS') {
            window.removeEventListener('message', onGoogleMessage);
            if (event.data.access_token) {
                await procesarTokenGoogle(event.data.access_token, redirectPrefix);
            } else if (event.data.id_token) {
                await enviarCredencialGoogleAlBackend({ credential: event.data.id_token }, redirectPrefix);
            }
        }
    };
    window.addEventListener('message', onGoogleMessage);

    // Escuchar respuesta o manejar cierre de ventana
    const timer = setInterval(function() {
        if (!googlePopup || googlePopup.closed) {
            clearInterval(timer);
            window.removeEventListener('message', onGoogleMessage);
        }
    }, 1000);
}

// Procesar token recibido de la interfaz de Google
async function procesarTokenGoogle(accessToken, redirectPrefix) {
    try {
        // Consultar el perfil real a la API oficial de Google
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        const googleProfile = await userInfoRes.json();

        if (googleProfile.email) {
            await enviarCredencialGoogleAlBackend({
                email: googleProfile.email,
                nombre: googleProfile.name,
                foto: googleProfile.picture
            }, redirectPrefix);
        }
    } catch (err) {
        console.error('Error al obtener perfil de Google:', err);
    }
}

// Enviar datos autenticados por Google al backend
async function enviarCredencialGoogleAlBackend(datosGoogle, redirectPrefix) {
    try {
        const res = await fetch('/api/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                ...datosGoogle,
                rol: 'cliente'
            })
        });

        const data = await res.json();
        if (res.ok) {
            CitriAuth.setUser(data.user);
            if (data.user.rol === 'admin') window.location.href = `${redirectPrefix}admin.html`;
            else if (data.user.rol === 'productor') window.location.href = `${redirectPrefix}panel_productor.html`;
            else window.location.href = `${redirectPrefix}perfil.html`;
        } else {
            alert(data.error || 'Error al autenticar con Google');
        }
    } catch (err) {
        console.error('Error al contactar servidor:', err);
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

                emailValidado = data.email;
                const previewLinkHtml = data.previewUrl 
                    ? `<div style="margin-top: 8px;"><a href="${data.previewUrl}" target="_blank" class="btn btn-outline" style="font-size: 0.75rem; padding: 4px 10px; display: inline-flex; align-items: center; gap: 4px; border-radius: 8px; color: #006837; border-color: #006837; text-decoration: none;"><span class="material-symbols-outlined" style="font-size: 16px;">open_in_new</span> Abrir Correo en Servidor de Pruebas (Ethereal)</a></div>`
                    : `<div style="margin-top: 8px;"><button type="button" onclick="verBuzonSimulado('${data.email}')" style="background: none; border: none; padding: 0; color: #006837; font-size: 0.75rem; font-weight: 700; text-decoration: underline; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;"><span class="material-symbols-outlined" style="font-size: 16px;">mail</span> ¿No tienes acceso a este correo? Ver bandeja local de prueba</button></div>`;

                codigoInfo.innerHTML = `
                    <div style="display: flex; align-items: flex-start; gap: 8px;">
                        <span class="material-symbols-outlined" style="font-size: 20px; color: #006837; margin-top: 2px;">mark_email_read</span>
                        <div>
                            <strong>¡Correo electrónico enviado con éxito!</strong><br>
                            Hemos despachado la clave de seguridad de 6 dígitos a <u>${data.email}</u>.<br>
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
                exitoInfo.innerHTML = `✓ Código validado correctamente para <b>${emailValidado}</b>. Establece tu nueva contraseña segura.`;

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

            if (nueva.length < 6) {
                error3.textContent = 'La nueva contraseña debe tener al menos 6 caracteres.';
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
                        <span style="font-size:0.75rem;color:#64748b;">Para: ${correo.destinatario} • ${new Date(correo.fecha).toLocaleTimeString()}</span>
                    </div>
                    <button onclick="document.getElementById('modal-buzon-simulado').style.display='none'" style="background:none;border:none;cursor:pointer;color:#64748b;padding:4px;">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div style="border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;background:#f8fafc;">
                    ${correo.htmlContent}
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


