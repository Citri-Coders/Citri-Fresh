// ==================== CATÁLOGO - FILTROS, PAGINACIÓN Y ACCIONES ====================

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('productos-grid');
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll('.producto-card'));
    const sinResultados = document.getElementById('sin-resultados');
    const contador = document.getElementById('contador-productos');
    const toastContainer = document.getElementById('toast-container');
    
    // Inputs de filtros
    const inputBusqueda = document.getElementById('busqueda');
    const selectTipo = document.getElementById('filtro-tipo');
    const selectZona = document.getElementById('filtro-zona');
    const selectPrecio = document.getElementById('filtro-precio');
    const btnLimpiar = document.getElementById('limpiar-filtros');
    
    // Paginación
    const paginacionNumeros = document.querySelectorAll('.paginacion-numero');
    const btnPrev = document.getElementById('paginacion-prev');
    const btnNext = document.getElementById('paginacion-next');
    
    // Estado
    let productosVisibles = [...cards];
    
    // ==================== FILTRAR ====================
    function filtrar() {
        const busqueda = inputBusqueda ? inputBusqueda.value.toLowerCase().trim() : '';
        const tipo = selectTipo ? selectTipo.value : 'todos';
        const zona = selectZona ? selectZona.value : 'todas';
        const orden = selectPrecio ? selectPrecio.value : 'relevancia';
        
        productosVisibles = cards.filter(card => {
            const nombre = card.querySelector('.producto-nombre')?.textContent.toLowerCase() || '';
            const descripcion = card.querySelector('.producto-descripcion')?.textContent.toLowerCase() || '';
            const cardTipo = card.dataset.tipo || '';
            const cardZona = card.dataset.zona || '';
            
            // Filtro por búsqueda
            const coincideBusqueda = !busqueda || 
                nombre.includes(busqueda) || 
                descripcion.includes(busqueda);
            
            // Filtro por tipo
            const coincideTipo = tipo === 'todos' || cardTipo === tipo;
            
            // Filtro por zona
            const coincideZona = zona === 'todas' || cardZona === zona;
            
            return coincideBusqueda && coincideTipo && coincideZona;
        });
        
        // Ordenar
        if (orden === 'precio-menor') {
            productosVisibles.sort((a, b) => 
                parseFloat(a.dataset.precio || 0) - parseFloat(b.dataset.precio || 0)
            );
        } else if (orden === 'precio-mayor') {
            productosVisibles.sort((a, b) => 
                parseFloat(b.dataset.precio || 0) - parseFloat(a.dataset.precio || 0)
            );
        }
        
        renderizar();
    }
    
    // ==================== RENDERIZAR ====================
    function renderizar() {
        // Ocultar todas las tarjetas
        cards.forEach(card => card.hidden = true);
        
        // Mostrar únicamente las filtradas en el orden calculado
        productosVisibles.forEach(card => {
            card.hidden = false;
            grid.appendChild(card);
        });
        
        // Actualizar contador
        if (contador) {
            contador.textContent = productosVisibles.length;
        }
        
        // Mostrar/ocultar estado "sin resultados"
        if (sinResultados) {
            sinResultados.hidden = productosVisibles.length > 0;
        }
    }
    
    // ==================== EVENT LISTENERS DE FILTRO ====================
    if (inputBusqueda) {
        inputBusqueda.addEventListener('input', debounce(filtrar, 250));
    }
    if (selectTipo) selectTipo.addEventListener('change', filtrar);
    if (selectZona) selectZona.addEventListener('change', filtrar);
    if (selectPrecio) selectPrecio.addEventListener('change', filtrar);
    
    // Limpiar filtros
    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', () => {
            if (inputBusqueda) inputBusqueda.value = '';
            if (selectTipo) selectTipo.value = 'todos';
            if (selectZona) selectZona.value = 'todas';
            if (selectPrecio) selectPrecio.value = 'relevancia';
            filtrar();
        });
    }
    
    // ==================== AGREGAR AL CARRITO / INTERACCIÓN ====================
    grid.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-agregar');
        if (!btn) return;
        
        const card = btn.closest('.producto-card');
        const nombreProducto = btn.dataset.nombre || card.querySelector('.producto-nombre')?.textContent || 'Producto';
        
        // Animación temporal en el botón
        const textoOriginal = btn.innerHTML;
        btn.classList.add('agregado');
        btn.innerHTML = '✓ ¡Agregado!';
        btn.disabled = true;
        
        setTimeout(() => {
            btn.classList.remove('agregado');
            btn.innerHTML = textoOriginal;
            btn.disabled = false;
        }, 1500);
        
        // Mostrar toast de confirmación
        mostrarToast(`🍊 Se agregó <strong>${nombreProducto}</strong> al carrito`);
    });
    
    function mostrarToast(mensaje) {
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = mensaje;
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 3000);
    }
    
    // ==================== PAGINACIÓN ====================
    paginacionNumeros.forEach(btn => {
        btn.addEventListener('click', () => {
            paginacionNumeros.forEach(b => {
                b.classList.remove('active');
                b.removeAttribute('aria-current');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-current', 'page');
            
            const esPrimera = btn.textContent.trim() === '1';
            if (btnPrev) btnPrev.disabled = esPrimera;
            if (btnNext) btnNext.disabled = !esPrimera;
            
            const productosSection = document.querySelector('.productos-section');
            if (productosSection) {
                productosSection.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
        });
    });
    
    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            const pagina1 = Array.from(paginacionNumeros).find(b => b.textContent.trim() === '1');
            if (pagina1) pagina1.click();
        });
    }
    
    if (btnNext) {
        btnNext.addEventListener('click', () => {
            const pagina2 = Array.from(paginacionNumeros).find(b => b.textContent.trim() === '2');
            if (pagina2) pagina2.click();
        });
    }
    
    // ==================== DEBOUNCE ====================
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
});
