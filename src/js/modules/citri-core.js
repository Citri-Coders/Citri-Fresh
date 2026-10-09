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

function limpiarEstadoLocalSesion() {
    try {
        localStorage.removeItem('citrifresh_user');
        localStorage.removeItem('citrifresh_cart');
        localStorage.removeItem('citrifresh_cart_owner');
        sessionStorage.clear();
    } catch (err) {
        console.warn('No se pudo limpiar el estado local de sesión:', err);
    }
}

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
    syncWithServer: async function() {
        try {
            const res = await fetch('/api/auth/me', { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                if (data && data.data) {
                    this.setUser(data.data);
                    return data.data;
                }
            } else if (res.status === 401) {
                // Si el servidor indica que la cookie/sesión expiró o no existe
                localStorage.removeItem('citrifresh_user');
                this.updateNavUI();
            }
        } catch (err) {
            // Sin conexión o fallo de red: mantener caché de localStorage
        }
        return this.getUser();
    },
    logout: async function() {
        // Limpiar primero el estado local para que el botón no dependa de la red.
        limpiarEstadoLocalSesion();

        let timeoutId;
        try {
            const logoutRequest = fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
                keepalive: true,
            }).then((res) => {
                if (!res.ok) {
                    console.warn('El servidor no confirmó el cierre de sesión:', res.status);
                }
            }).catch((err) => {
                console.warn('Error al llamar /api/auth/logout:', err);
            });

            // Evitar dejar la interfaz esperando indefinidamente si el servidor no responde.
            await Promise.race([
                logoutRequest,
                new Promise((resolve) => {
                    timeoutId = window.setTimeout(resolve, 2000);
                }),
            ]);
        } finally {
            if (timeoutId) window.clearTimeout(timeoutId);
            window.location.replace('/pages/inicio.html');
        }
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
                    <form action="/api/auth/logout" method="POST" style="display: inline-flex; margin: 0;">
                        <button type="submit" class="btn btn-icon text-muted hover:text-error flex items-center gap-xs" style="cursor: pointer; padding: 0.35rem 0.6rem; border-radius: 8px; border: 1px solid #e2e8f0;" title="Cerrar Sesión">
                            <span class="material-symbols-outlined" style="color: #dc2626; font-size: 19px;">logout</span>
                            <span style="font-size: 0.75rem; font-weight: 700; color: #dc2626;" class="hidden sm-inline">Salir</span>
                        </button>
                    </form>
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
                    <form action="/api/auth/logout" method="POST" style="display: inline-flex; margin: 0;">
                        <button type="submit" class="btn btn-icon text-muted hover:text-error flex items-center gap-xs" style="cursor: pointer; padding: 0.35rem 0.6rem; border-radius: 8px; border: 1px solid #e2e8f0;" title="Cerrar Sesión">
                            <span class="material-symbols-outlined" style="color: #dc2626; font-size: 19px;">logout</span>
                            <span style="font-size: 0.75rem; font-weight: 700; color: #dc2626;" class="hidden sm-inline">Salir</span>
                        </button>
                    </form>
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
                    <form action="/api/auth/logout" method="POST" style="display: inline-flex; margin: 0;">
                        <button type="submit" class="btn btn-icon text-muted hover:text-error flex items-center gap-xs" style="cursor: pointer; padding: 0.35rem 0.6rem; border-radius: 8px; border: 1px solid #e2e8f0;" title="Cerrar Sesión">
                            <span class="material-symbols-outlined" style="color: #dc2626; font-size: 19px;">logout</span>
                            <span style="font-size: 0.75rem; font-weight: 700; color: #dc2626;" class="hidden sm-inline">Salir</span>
                        </button>
                    </form>
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
                    <form action="/api/auth/logout" method="POST" style="display: inline-flex; margin: 0;">
                        <button type="submit" class="btn btn-icon text-muted hover:text-error flex items-center gap-xs" style="cursor: pointer; padding: 0.35rem 0.6rem; border-radius: 8px; border: 1px solid #e2e8f0;" title="Cerrar Sesión">
                            <span class="material-symbols-outlined" style="color: #dc2626; font-size: 19px;">logout</span>
                            <span style="font-size: 0.75rem; font-weight: 700; color: #dc2626;" class="hidden sm-inline">Salir</span>
                        </button>
                    </form>
                    <button class="mobile-menu-btn" aria-label="Abrir Menú">
                        <span class="material-symbols-outlined">menu</span>
                    </button>
                `;
            }
        }

        // 3. Mantener sincronizado el contador del carrito en todas las páginas
        if (window.CitriCart && typeof window.CitriCart.updateCartBadge === 'function') {
            window.CitriCart.updateCartBadge();
        }
    }
};

// ==================== GESTOR DEL CARRITO DE COMPRAS (CitriCart) ====================
const CitriCart = {
    STORAGE_KEY: 'citrifresh_cart',
    OWNER_KEY: 'citrifresh_cart_owner',

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
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
        } catch (err) {
            // Cuota de localStorage superada (p. ej. imágenes base64 muy grandes).
            // Se reintenta guardando el carrito sin las imágenes pesadas.
            console.warn('Cuota de localStorage superada al guardar el carrito. Se guarda sin imágenes pesadas.', err);
            const itemsSinImagen = items.map(item => ({ ...item, imagen: '/public/images/n-comer.jpg' }));
            try {
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(itemsSinImagen));
            } catch (err2) {
                console.error('No fue posible guardar el carrito en localStorage:', err2);
            }
        }
        this.updateCartBadge();
        window.dispatchEvent(new CustomEvent('citri:cart-updated', { detail: { items } }));
    },

    // Genera una miniatura JPEG a partir de un <img> ya cargado, para no almacenar
    // imágenes base64 de gran tamaño en el carrito (localStorage).
    crearMiniatura: function(imgEl, maxDim = 160) {
        try {
            if (!imgEl) return '';
            let w = imgEl.naturalWidth || imgEl.width;
            let h = imgEl.naturalHeight || imgEl.height;
            if (!w || !h) return '';
            if (w > h) {
                if (w > maxDim) { h = Math.round(h * maxDim / w); w = maxDim; }
            } else {
                if (h > maxDim) { w = Math.round(w * maxDim / h); h = maxDim; }
            }
            const canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            canvas.getContext('2d').drawImage(imgEl, 0, 0, w, h);
            return canvas.toDataURL('image/jpeg', 0.6);
        } catch (e) {
            return '';
        }
    },

    // ¿Hay una sesión de usuario válida almacenada localmente?
    _usuarioAutenticado: function() {
        try {
            return typeof CitriAuth !== 'undefined' ? CitriAuth.getUser() : null;
        } catch (e) {
            return null;
        }
    },

    // Petición JSON al backend del carrito (con credenciales de sesión)
    _peticion: async function(metodo, ruta, body) {
        const opciones = {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        };
        if (body !== undefined) opciones.body = JSON.stringify(body);
        const res = await fetch(ruta, opciones);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        try {
            return (await res.json()).data;
        } catch (e) {
            return null;
        }
    },

    // Sincroniza el carrito local con el del servidor (fuente de verdad para
    // usuarios autenticados). Si es el primer inicio de sesión con un carrito de
    // invitado, lo fusiona antes de traer el carrito del servidor.
    sincronizarConServidor: async function() {
        const user = this._usuarioAutenticado();
        if (!user) return this.getItems();

        const owner = localStorage.getItem(this.OWNER_KEY);
        const localItems = this.getItems();

        if (String(owner) !== String(user.id) && localItems.length > 0) {
            try {
                await this._peticion('POST', '/api/carrito/sincronizar', {
                    items: localItems.map(i => ({
                        producto_id: Number(i.id),
                        cantidad: Number(i.cantidad) || 1
                    }))
                });
                localStorage.setItem(this.OWNER_KEY, String(user.id));
            } catch (e) {
                // Sin conexión: no se marca el carrito como sincronizado para reintentar luego
                return this.getItems();
            }
        } else {
            localStorage.setItem(this.OWNER_KEY, String(user.id));
        }

        try {
            const serverItems = await this._peticion('GET', '/api/carrito');
            if (Array.isArray(serverItems)) {
                const localMap = new Map(localItems.map(i => [Number(i.id), i]));
                const normalizados = serverItems.map(si => {
                    const local = localMap.get(Number(si.id));
                    return {
                        id: Number(si.id),
                        nombre: si.nombre,
                        precio: Number(si.precio) || 0,
                        unidad: si.unidad,
                        imagen: si.imagen || (local && local.imagen) || '/public/images/n-comer.jpg',
                        productor: si.productor,
                        cantidad: Number(si.cantidad) || 1
                    };
                });
                this.saveItems(normalizados);
                return normalizados;
            }
        } catch (e) {
            // Sin conexión: se conserva el carrito local
        }
        return this.getItems();
    },

    addItem: function(producto) {
        const items = this.getItems();
        const prodId = Number(producto.id);
        const existing = items.find(item => Number(item.id) === prodId);
        const cantidadAgregada = Number(producto.cantidad) || 1;

        if (existing) {
            existing.cantidad = (Number(existing.cantidad) || 1) + cantidadAgregada;
        } else {
            items.push({
                id: prodId,
                nombre: producto.nombre || 'Producto Cítrico',
                precio: Number(producto.precio) || 0,
                unidad: producto.unidad || 'caja',
                imagen: producto.imagen || '/public/images/n-comer.jpg',
                productor: producto.productor || 'Finca Cítrica',
                cantidad: cantidadAgregada
            });
        }

        this.saveItems(items);

        // Persistir en el servidor si hay sesión activa
        if (this._usuarioAutenticado()) {
            this._peticion('POST', '/api/carrito', {
                producto_id: prodId,
                cantidad: cantidadAgregada
            }).catch(() => {});
        }
        return this.getItems();
    },

    updateQuantity: function(id, cantidad) {
        let items = this.getItems();
        const qty = parseInt(cantidad, 10);
        const prodId = Number(id);

        if (!Number.isFinite(qty)) return items;

        if (qty <= 0) {
            items = items.filter(item => Number(item.id) !== prodId);
        } else {
            const item = items.find(item => Number(item.id) === prodId);
            if (item) item.cantidad = qty;
        }

        this.saveItems(items);

        if (this._usuarioAutenticado()) {
            this._peticion('PUT', '/api/carrito/' + prodId, { cantidad: Math.max(0, qty) })
                .catch(() => {});
        }
        return items;
    },

    removeItem: function(id) {
        const prodId = Number(id);
        const items = this.getItems().filter(item => Number(item.id) !== prodId);
        this.saveItems(items);

        if (this._usuarioAutenticado()) {
            this._peticion('DELETE', '/api/carrito/' + prodId).catch(() => {});
        }
        return items;
    },

    clear: function() {
        localStorage.removeItem(this.STORAGE_KEY);
        this.updateCartBadge();
        window.dispatchEvent(new CustomEvent('citri:cart-updated', { detail: { items: [] } }));

        if (this._usuarioAutenticado()) {
            this._peticion('DELETE', '/api/carrito').catch(() => {});
        }
    },

    getCount: function() {
        const items = this.getItems();
        return items.reduce((acc, item) => acc + (Number(item.cantidad) || 0), 0);
    },

    // Cantidad de productos distintos (líneas) en el carrito, sin sumar sus unidades
    getProductCount: function() {
        return this.getItems().length;
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
            totalItems: this.getProductCount()
        };
    },

    updateCartBadge: function() {
        const count = this.getProductCount();
        document.querySelectorAll('.cart-count-badge').forEach(badge => {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        });
    }
};

// Exposición global explícita en window
if (typeof window !== 'undefined') {
    document.addEventListener('submit', (event) => {
        if (event.target?.matches?.('form[action="/api/auth/logout"]')) {
            // Mantener el mismo comportamiento de limpieza cuando el cierre
            // se envía como formulario nativo sin invocar CitriAuth.logout().
            limpiarEstadoLocalSesion();
        }
    }, true);

    window.CitriAuth = CitriAuth;
    window.CitriCart = CitriCart;
    window.CitriSync = CitriSync;
}
