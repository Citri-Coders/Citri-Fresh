// ==================== APP.JS - PUNTO DE ENTRADA PRINCIPAL ====================

import { initNavigation } from './common/nav.js';
import { initScrollAnimations } from './common/animations.js';

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollAnimations();
});