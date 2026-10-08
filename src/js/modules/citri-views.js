// ==================== FUNCIONES DINÁMICAS DE VISTAS ====================

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

// Escapar para atributos HTML
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
        // Mostrar skeleton en tabla de pedidos del cliente
        const skelTbody = document.getElementById('pedidos-tbody');
        if (skelTbody) {
            skelTbody.innerHTML = Array.from({ length: 3 }).map(() => `
                <tr class="skeleton-row">
                    <td><div class="skeleton" style="width: 60px;"></div></td>
                    <td><div class="skeleton" style="width: 90px;"></div></td>
                    <td><div class="skeleton" style="width: 140px;"></div></td>
                    <td><div class="skeleton" style="width: 70px;"></div></td>
                    <td><div class="skeleton" style="width: 70px;"></div></td>
                    <td><div class="skeleton" style="width: 40px;"></div></td>
                </tr>
            `).join('');
        }

        const res = await fetch('/api/pedidos', { credentials: 'include' });
        if (res.ok) {
            const pedidos = (await res.json()).data;
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
                            ? p.items.map(i => `${escapeHtml(i.producto_nombre)} (x${escapeHtml(String(i.cantidad))})`).join(', ')
                            : (p.total_items ? `${p.total_items} producto(s) cítricos` : 'Cítricos seleccionados');
                        const estadoBadge = (p.estado === 'entregado' || p.estado === 'completado')
                            ? '<span class="badge badge-success">Entregado</span>'
                            : (p.estado === 'enviado'
                                ? '<span class="badge" style="background-color: var(--color-surface-container); color: var(--color-primary);">Enviado</span>'
                                : '<span class="badge" style="background-color: rgba(255,199,59,0.2); color: var(--color-text-dark);">Pendiente</span>');

                        return `
                            <tr>
                                <td style="font-weight: 700;">#CF-${escapeHtml(String(p.id))}</td>
                                <td class="text-muted">${escapeHtml(fecha)}</td>
                                <td class="text-muted" style="max-width: 220px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${escapeAttr(itemsText)}">
                                    ${itemsText}
                                </td>
                                <td class="text-primary" style="font-weight: 700;">C$ ${Number(p.total).toFixed(2)}</td>
                                <td>${estadoBadge}</td>
                                <td style="text-align: center;">
                                    <button onclick="verDetallePedidoCliente(${parseInt(p.id, 10)})" class="btn btn-icon text-muted hover:text-primary" title="Ver Detalle">
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

    // Actualizar nombre en el encabezado
    const fincaEl = document.getElementById('productor-finca-nombre');
    if (fincaEl) {
        fincaEl.textContent = `Bienvenido ${user.nombre || 'Productor'} • Productor Demostrativo (Rivas / Masaya)`;
    }

    try {
        // 1. Cargar productos del productor desde la BD
        // Mostrar skeleton loaders en inventario
        const invContainer = document.getElementById('productor-inventario-list');
        if (invContainer) {
            invContainer.innerHTML = Array.from({ length: 3 }).map(() => `
                <div class="skeleton-inventory-item">
                    <div class="skeleton skeleton-thumb"></div>
                    <div class="skeleton-content">
                        <div class="skeleton skeleton-line skeleton-line-medium" style="height: 0.875rem;"></div>
                        <div class="skeleton skeleton-line skeleton-line-short" style="height: 0.75rem;"></div>
                    </div>
                </div>
            `).join('');
        }

        // Mostrar skeleton en tabla de pedidos
        const pedTbody = document.getElementById('productor-pedidos-tbody');
        if (pedTbody) {
            pedTbody.innerHTML = Array.from({ length: 3 }).map(() => `
                <tr class="skeleton-row">
                    <td><div class="skeleton" style="width: 60px;"></div></td>
                    <td><div class="skeleton" style="width: 120px;"></div></td>
                    <td><div class="skeleton" style="width: 80px;"></div></td>
                    <td><div class="skeleton" style="width: 70px;"></div></td>
                    <td><div class="skeleton" style="width: 60px;"></div></td>
                    <td><div class="skeleton" style="width: 80px;"></div></td>
                </tr>
            `).join('');
        }

        const resProd = await fetch(`/api/productos?productor_id=${user.id}`, { credentials: 'include' });
        let productos = [];
        if (resProd.ok) {
            productos = (await resProd.json()).data;
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
                                <img alt="${escapeAttr(p.nombre)}" src="${escapeAttr(p.imagen || '/public/images/l-criollo.jpg')}" style="width: 48px; height: 48px; border-radius: var(--radius-md); object-fit: cover; flex-shrink: 0;">
                                <div style="min-width: 0;">
                                    <h3 style="margin: 0; font-size: var(--text-label); font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(p.nombre)}</h3>
                                    <p class="text-muted" style="margin: 0; font-size: var(--text-caption);">C$ ${Number(p.precio).toFixed(2)} / ${escapeHtml(p.unidad)} • Zona: ${escapeHtml(p.zona_nombre || 'Nicaragua')}</p>
                                </div>
                            </div>
                            <div style="text-align: right; margin: 0 1rem; flex-shrink: 0;">
                                <div class="text-primary" style="font-weight: 700; font-size: var(--text-label);">${escapeHtml(String(p.stock))} ${escapeHtml(p.unidad)}s</div>
                                <div class="badge ${Number(p.stock) < 50 ? 'badge-error' : 'badge-success'}" style="margin-top: 4px;">
                                    ${Number(p.stock) < 50 ? 'Stock Bajo' : 'En Stock'}
                                </div>
                            </div>
                            <div class="flex items-center gap-xs" style="flex-shrink: 0;">
                                <button onclick="abrirModalEditarProducto(${parseInt(p.id, 10)})" class="btn btn-icon text-muted hover:text-primary" title="Editar Lote">
                                    <span class="material-symbols-outlined">edit</span>
                                </button>
                                <button onclick="eliminarProductoProductor(${parseInt(p.id, 10)})" class="btn btn-icon text-muted hover:text-error" title="Eliminar Lote">
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
            const pedidos = (await resPed.json()).data;
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
                                    <button onclick="cambiarEstadoPedidoProductor(${parseInt(p.id, 10)}, 'enviado')" class="btn btn-sm btn-primary" title="Aceptar y Despachar" style="padding: 0.25rem 0.6rem; font-size: 0.75rem;">
                                        <span class="material-symbols-outlined" style="font-size: 15px;">local_shipping</span> Despachar
                                    </button>
                                    <button onclick="cambiarEstadoPedidoProductor(${parseInt(p.id, 10)}, 'cancelado')" class="btn btn-sm" title="Rechazar Pedido" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; background: rgba(186,26,26,0.1); color: var(--color-error); border: none;">
                                        <span class="material-symbols-outlined" style="font-size: 15px;">close</span>
                                    </button>
                                </div>
                            `;
                        } else if (p.estado === 'enviado') {
                            accionesHtml = `
                                <button onclick="cambiarEstadoPedidoProductor(${parseInt(p.id, 10)}, 'completado')" class="btn btn-sm btn-accent" title="Marcar como Entregado" style="padding: 0.25rem 0.6rem; font-size: 0.75rem;">
                                    <span class="material-symbols-outlined" style="font-size: 15px;">done_all</span> Marcar Entregado
                                </button>
                            `;
                        } else {
                            accionesHtml = `<span class="text-muted" style="font-size: var(--text-caption);">Finalizado</span>`;
                        }

                        return `
                            <tr>
                                <td style="font-weight: 700;">#CF-${escapeHtml(String(p.id))}</td>
                                <td>
                                    <div style="font-weight: 600;">${escapeHtml(p.cliente_nombre || 'Cliente Registrado')}</div>
                                    <div class="text-muted" style="font-size: var(--text-caption);">${escapeHtml(p.cliente_email || '')}</div>
                                </td>
                                <td class="text-muted">${escapeHtml(fecha)}</td>
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
    const ok = await confirm(`¿Estás seguro de que deseas ${accionTexto} el pedido #CF-${pedidoId}?`);
    if (!ok) return;

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
    const ok = await confirm('¿Estás seguro de que deseas eliminar este lote de tu inventario? Esta acción no se puede deshacer.');
    if (!ok) return;

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

    // Mostrar skeleton loaders mientras se cargan los datos
    const skeletonCount = 8;
    grid.innerHTML = Array.from({ length: skeletonCount }).map(() => `
        <div class="product-card skeleton-card">
            <div class="skeleton skeleton-image"></div>
            <div class="skeleton-body">
                <div class="skeleton skeleton-line skeleton-line-short"></div>
                <div class="skeleton skeleton-line skeleton-line-medium"></div>
                <div class="skeleton skeleton-line"></div>
                <div class="skeleton skeleton-line skeleton-line-short"></div>
            </div>
        </div>
    `).join('');

    try {
        const res = await fetch('/api/productos');
        if (!res.ok) {
            grid.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--color-text-muted);">No se pudieron cargar los productos en este momento.</p>';
            return;
        }

        const productos = (await res.json()).data;
        if (productos.length === 0) {
            grid.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--color-text-muted);">No hay productos disponibles aún.</p>';
            return;
        }

        // Renderizar productos reales de la base de datos
        grid.innerHTML = productos.map(p => {
            const categoria = p.nombre.toLowerCase().includes('naranja') ? 'naranjas' 
                : (p.nombre.toLowerCase().includes('limón') || p.nombre.toLowerCase().includes('limon') ? 'limones' : 'mandarinas');
            const fallbackImg = categoria === 'limones' ? '/public/images/l-criollo.jpg' 
                : (categoria === 'mandarinas' ? '/public/images/mandarina.jpeg' : '/public/images/n-comer.jpg');
            const imagen = p.imagen || fallbackImg;

            return `
                <div class="product-card" data-category="${escapeAttr(categoria)}">
                    <div class="product-image-container">
                        <img src="${escapeAttr(imagen)}" alt="${escapeAttr(p.nombre)}" class="product-image" style="object-position: center;" onerror="if(!this.dataset.fallback){this.dataset.fallback=1;this.src='${escapeAttr(fallbackImg)}';}else{this.src='/public/images/Citri_Fresh_V1.0.png';}">
                        <div class="product-badges">
                            <span class="badge badge-success">${escapeHtml(p.zona_nombre || 'Nicaragua')}</span>
                        </div>
                    </div>
                    <div class="product-info">
                        <span class="product-category">${escapeHtml(categoria.toUpperCase())}</span>
                        <h2 class="product-name">${escapeHtml(p.nombre)}</h2>
                        <div class="product-seller">
                            <span class="material-symbols-outlined" style="font-size: 16px;">storefront</span>
                            ${escapeHtml(p.productor_nombre ? p.productor_nombre.replace(/Finca/gi, 'Productor') : 'Lote Demostrativo')}
                        </div>
                        
                        <div class="product-price-row">
                            <div class="product-price">C$ ${Number(p.precio).toFixed(0)} <span class="product-unit">/ ${escapeHtml(p.unidad)}</span></div>
                        </div>
                        
                        <div class="product-actions">
                            <a href="detalle_producto.html?id=${parseInt(p.id, 10)}" class="btn-details" title="Ver Detalles">
                                <span class="material-symbols-outlined">visibility</span>
                            </a>
                            <button class="btn-cart" data-id="${escapeAttr(String(p.id))}" data-name="${escapeAttr(p.nombre)}" data-price="${escapeAttr(String(p.precio))}">
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
        grid.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--color-text-muted);">Error de conexión. No se pudieron cargar los productos.</p>';
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
