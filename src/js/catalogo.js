// ==================== CATÁLOGO - FILTROS Y PAGINACIÓN ====================

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('productos-grid');
    const cards = Array.from(grid.querySelectorAll('.producto-card'));
    const sinResultados = document.getElementById('sin-resultados');
    const contador = document.getElementById('contador-productos');
    
    // Inputs de filtros
    const inputBusqueda = document.getElementById('busqueda');
    const selectTipo = document.getElementById('filtro-tipo');
    const selectZona = document.getElementById('filtro-zona');
    const selectPrecio = document.getElementById('filtro-precio');
    const btnLimpiar = document.getElementById('limpiar-filtros');
    
    // Estado
    let productosVisibles = [...cards];
    
    // ==================== FILTRAR ====================
    function filtrar() {
        const busqueda = inputBusqueda.value.toLowerCase().trim();
        const tipo = selectTipo.value;
        const zona = selectZona.value;
        const orden = selectPrecio.value;
        
        productosVisibles = cards.filter(card => {
            const nombre = card.querySelector('.producto-nombre').textContent.toLowerCase();
            const descripcion = card.querySelector('.producto-descripcion').textContent.toLowerCase();
            const cardTipo = card.dataset.tipo;
            const cardZona = card.dataset.zona;
            
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
                parseFloat(a.dataset.precio) - parseFloat(b.dataset.precio)
            );
        } else if (orden === 'precio-mayor') {
            productosVisibles.sort((a, b) => 
                parseFloat(b.dataset.precio) - parseFloat(a.dataset.precio)
            );
        }
        // 'relevancia' y 'recientes' mantienen orden original
        
        renderizar();
    }
    
    // ==================== RENDERIZAR ====================
    function renderizar() {
        // Ocultar todas
        cards.forEach(card => card.hidden = true);
        
        // Mostrar filtradas
        productosVisibles.forEach(card => {
            card.hidden = false;
            grid.appendChild(card); // Reordenar en DOM
        });
        
        // Actualizar contador
        contador.textContent = productosVisibles.length;
        
        // Mostrar/ocultar "sin resultados"
        sinResultados.hidden = productosVisibles.length > 0;
    }
    
    // ==================== EVENT LISTENERS ====================
    inputBusqueda.addEventListener('input', debounce(filtrar, 300));
    selectTipo.addEventListener('change', filtrar);
    selectZona.addEventListener('change', filtrar);
    selectPrecio.addEventListener('change', filtrar);
    
    // Limpiar filtros
    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', () => {
            inputBusqueda.value = '';
            selectTipo.value = 'todos';
            selectZona.value = 'todas';
            selectPrecio.value = 'relevancia';
            filtrar();
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
    
    // ==================== PAGINACIÓN (básica) ====================
    const paginacionNumeros = document.querySelectorAll('.paginacion-numero');
    
    paginacionNumeros.forEach(btn => {
        btn.addEventListener('click', () => {
            paginacionNumeros.forEach(b => {
                b.classList.remove('active');
                b.removeAttribute('aria-current');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-current', 'page');
            
            // Scroll al inicio de productos
            document.querySelector('.productos-section').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        });
    });
});