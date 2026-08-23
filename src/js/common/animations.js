// ==================== ANIMACIONES EN SCROLL ====================

export function initScrollAnimations() {
    const animatableElements = document.querySelectorAll('.category-card, .benefit-item, .producto-card');
    if (animatableElements.length === 0 || !('IntersectionObserver' in window)) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatableElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        observer.observe(el);
    });

    if (!document.getElementById('scroll-anim-style')) {
        const style = document.createElement('style');
        style.id = 'scroll-anim-style';
        style.textContent = `
            .visible {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }
}
