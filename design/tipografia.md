# 🔤 Tipografía — CITRI - CODERS

> **Proyecto:** CITRI - CODERS  
> **Versión:** 1.0  
> **Año:** 2026  
> **Última actualización:** 2026-08-11

---

## 📋 Índice

1. [Filosofía Tipográfica](#filosofía-tipográfica)
2. [Tipografía Principal — MONT](#tipografía-principal--mont)
3. [Tipografía Secundaria — KIONA](#tipografía-secundaria--kiona)
4. [Escala Tipográfica](#escala-tipográfica)
5. [Pares de Fuente Recomendados](#pares-de-fuente-recomendados)
6. [Variables CSS](#variables-css)
7. [Implementación Web](#implementación-web)

---

## 🌿 Filosofía Tipográfica

> Las tipografías Sans Serif fueron seleccionadas por su estilo limpio, versátil y legible, proyectando una identidad moderna, cercana y funcional, vinculada con la esencia del sector agrícola y adaptable a diversos soportes de comunicación.

Las fuentes elegidas reflejan los valores de la marca:
- **Modernidad:** Líneas limpias sin serifa que evocan innovación tecnológica.
- **Cercanía:** Formas amigables y legibles que conectan con el productor agrícola.
- **Funcionalidad:** Excelente legibilidad en pantallas de todos los tamaños.
- **Versatilidad:** Amplia gama de pesos para construir jerarquía visual.

---

## 🔤 Tipografía Principal — MONT

| Atributo | Valor |
|----------|-------|
| **Nombre** | Mont |
| **Clasificación** | Sans Serif Geométrica |
| **Rol** | Tipografía principal de la marca |
| **Uso** | Títulos, subtítulos, cuerpo de texto, UI |
| **Estilo** | Moderno, limpio, versátil |

### Pesos disponibles

| Peso | Uso recomendado |
|------|-----------------|
| **Light** (300) | Textos largos, descripciones secundarias, pies de página |
| **Regular** (400) | Cuerpo de texto principal, párrafos, etiquetas |
| **Bold** (700) | Subtítulos, enlaces destacados, datos importantes |
| **Black** (900) | Títulos principales, hero banners, números destacados |

### Caracteres soportados

```
Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn
Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz
1 2 3 4 5 6 7 8 9 0 # $ % & @ ?
```

### Jerarquía con MONT

| Elemento | Peso | Tamaño (desktop) | Tamaño (móvil) |
|----------|------|-------------------|----------------|
| H1 — Título principal | Black (900) | 48–64 px | 32–40 px |
| H2 — Sección | Bold (700) | 32–40 px | 24–28 px |
| H3 — Subsección | Bold (700) | 24–28 px | 20–22 px |
| H4 — Tarjeta / Widget | Bold (700) | 18–20 px | 16–18 px |
| Body — Texto principal | Regular (400) | 16 px | 14–16 px |
| Caption — Pie / Nota | Light (300) | 12–14 px | 12 px |
| Label — Etiqueta | Regular (400) | 12–14 px | 12 px |

---

## 🔠 Tipografía Secundaria — KIONA

| Atributo | Valor |
|----------|-------|
| **Nombre** | Kiona |
| **Clasificación** | Sans Serif Moderna |
| **Rol** | Tipografía secundaria / de acento |
| **Uso** | Títulos especiales, acentos de marca, números destacados, citas |
| **Estilo** | Elegante, distintiva, con carácter |

### Pesos disponibles

| Peso | Uso recomendado |
|------|-----------------|
| **Light Italic** (300i) | Citas, énfasis elegante, textos poéticos |
| **Regular** (400) | Subtítulos especiales, textos cortos de acento |
| **Semi Bold** (600) | Títulos de sección, números destacados |
| **Bold** (700) | Títulos de impacto, hero text, acentos de marca |

### Caracteres soportados

```
AA BB CC DD EE FF GG HH II JJ KK LL MM NN
OO PP QQ RR SS TT UU VV WW XX YY ZZ
1 2 3 4 5 6 7 8 9 0 # $ % & @ ?
```

### Jerarquía con KIONA

| Elemento | Peso | Tamaño (desktop) | Tamaño (móvil) |
|----------|------|-------------------|----------------|
| Hero Title | Bold (700) | 56–72 px | 36–48 px |
| Section Accent | Semi Bold (600) | 28–36 px | 22–28 px |
| Quote / Testimonial | Light Italic (300i) | 18–22 px | 16–18 px |
| Number Highlight | Bold (700) | 40–56 px | 28–36 px |

---

## 📐 Escala Tipográfica

### Escala modular (base: 16 px)

| Token | Tamaño | Línea | Uso |
|-------|--------|-------|-----|
| `text-hero` | 64 px / 4 rem | 1.1 | Título hero con Kiona Bold |
| `text-h1` | 48 px / 3 rem | 1.2 | Título de página con Mont Black |
| `text-h2` | 32 px / 2 rem | 1.3 | Título de sección con Mont Bold |
| `text-h3` | 24 px / 1.5 rem | 1.4 | Subtítulo con Mont Bold |
| `text-h4` | 20 px / 1.25 rem | 1.4 | Título de tarjeta con Mont Bold |
| `text-body` | 16 px / 1 rem | 1.6 | Cuerpo de texto con Mont Regular |
| `text-small` | 14 px / 0.875 rem | 1.5 | Texto secundario con Mont Regular |
| `text-caption` | 12 px / 0.75 rem | 1.5 | Pie, nota legal con Mont Light |

---

## 🔗 Pares de Fuente Recomendados

### Combinación 1: Título + Cuerpo (Uso general)

```
Título:    Kiona Bold      → "Cultivando el Futuro"
Subtítulo: Mont Bold       → "Tecnología para el campo nicaragüense"
Cuerpo:    Mont Regular    → "Descripción del proyecto..."
Caption:   Mont Light      → "© 2026 CITRI - CODERS"
```

### Combinación 2: Impacto visual (Landing page)

```
Hero:      Kiona Bold      → "CITRI"
Tagline:   Kiona Semi Bold → "CODERS"
Body:      Mont Regular    → "Innovación agrícola..."
CTA:       Mont Bold       → "Conocer más"
```

### Combinación 3: Editorial / Blog

```
Título:    Mont Black      → "Guía de Cultivo de Cítricos"
Lead:      Mont Light      → "Resumen introductorio..."
Cuerpo:    Mont Regular    → "Contenido del artículo..."
Quote:     Kiona Light It  → "La tierra nos da todo..."
```

---

## 🧩 Variables CSS

```css
:root {
  /* ── Familias tipográficas ── */
  --font-primary:   'Mont', 'Montserrat', 'Helvetica Neue', Arial, sans-serif;
  --font-secondary: 'Kiona', 'Montserrat', 'Helvetica Neue', Arial, sans-serif;

  /* ── Pesos ── */
  --font-weight-light:       300;
  --font-weight-regular:     400;
  --font-weight-semibold:    600;
  --font-weight-bold:        700;
  --font-weight-black:       900;

  /* ── Tamaños (escala modular) ── */
  --text-hero:     4rem;      /* 64 px */
  --text-h1:       3rem;      /* 48 px */
  --text-h2:       2rem;      /* 32 px */
  --text-h3:       1.5rem;    /* 24 px */
  --text-h4:       1.25rem;   /* 20 px */
  --text-body:     1rem;      /* 16 px */
  --text-small:    0.875rem;  /* 14 px */
  --text-caption:  0.75rem;   /* 12 px */

  /* ── Interlineado ── */
  --leading-tight:   1.1;
  --leading-snug:    1.2;
  --leading-normal:  1.4;
  --leading-relaxed: 1.6;
  --leading-loose:   1.8;

  /* ── Espaciado entre letras ── */
  --tracking-tight:  -0.02em;
  --tracking-normal:  0;
  --tracking-wide:    0.05em;
  --tracking-wider:   0.1em;
}
```

---

## 🌐 Implementación Web

### Carga de fuentes (Google Fonts / CDN)

```html
<!-- Mont (alternativa: Montserrat si Mont no está disponible) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700;900&display=swap" rel="stylesheet">

<!-- Kiona (requiere licencia o archivo local) -->
<!-- Si no está disponible, usar Montserrat como fallback -->
```

### Uso en CSS / Tailwind

```css
/* Estilos base */
body {
  font-family: var(--font-primary);
  font-weight: var(--font-weight-regular);
  font-size: var(--text-body);
  line-height: var(--leading-relaxed);
  color: var(--color-text);        /* #3F1504 */
  background-color: var(--color-background); /* #FFFFFF */
}

/* Títulos */
h1, h2, h3, h4 {
  font-family: var(--font-primary);
  font-weight: var(--font-weight-bold);
  line-height: var(--leading-snug);
  color: var(--color-verde-oscuro); /* #0C3E26 */
}

h1 {
  font-size: var(--text-h1);
  font-weight: var(--font-weight-black);
}

h2 { font-size: var(--text-h2); }
h3 { font-size: var(--text-h3); }
h4 { font-size: var(--text-h4); }

/* Hero con Kiona */
.hero-title {
  font-family: var(--font-secondary);
  font-weight: var(--font-weight-bold);
  font-size: var(--text-hero);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
}

/* Citas con Kiona Italic */
.quote {
  font-family: var(--font-secondary);
  font-weight: var(--font-weight-light);
  font-style: italic;
  font-size: var(--text-h3);
  line-height: var(--leading-normal);
}

/* Etiquetas y captions */
.caption {
  font-family: var(--font-primary);
  font-weight: var(--font-weight-light);
  font-size: var(--text-caption);
  color: var(--color-marron-negro);
  opacity: 0.7;
}
```

### Tailwind CSS (configuración)

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        primary: ['Mont', 'Montserrat', 'sans-serif'],
        secondary: ['Kiona', 'Montserrat', 'sans-serif'],
      },
      fontSize: {
        'hero': ['4rem', { lineHeight: '1.1' }],
        'h1': ['3rem', { lineHeight: '1.2' }],
        'h2': ['2rem', { lineHeight: '1.3' }],
        'h3': ['1.5rem', { lineHeight: '1.4' }],
        'h4': ['1.25rem', { lineHeight: '1.4' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'small': ['0.875rem', { lineHeight: '1.5' }],
        'caption': ['0.75rem', { lineHeight: '1.5' }],
      },
      fontWeight: {
        light: '300',
        regular: '400',
        semibold: '600',
        bold: '700',
        black: '900',
      },
    },
  },
}
```

---

## 📝 Notas de implementación

- **Mont:** Si la fuente "Mont" no está disponible en tu stack, usa **Montserrat** como sustituto directo. Comparten la misma clasificación geométrica y pesos equivalentes.
- **Kiona:** Es una fuente comercial. Si no se cuenta con licencia, usar Montserrat Bold/Black como fallback para títulos de impacto.
- **Renderizado:** Usar `font-display: swap` para evitar FOIT (Flash of Invisible Text).
- **Accesibilidad:** Mantener el tamaño mínimo de texto en 12 px (`text-caption`). No usar Light para textos menores a 14 px.
- **Móvil:** Reducir tamaños hero en un 30–40 % en pantallas pequeñas para evitar overflow.

---

> *Documento generado a partir de la guía de marca visual CITRI - CODERS v1.0 (2026).*
