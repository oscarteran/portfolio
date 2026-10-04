# Handoff: Rediseño del portafolio (dirección "Sismograma")

Repo destino: `oscarteran/portfolio` (Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion).

## Resumen
Rediseño visual completo del portafolio para la búsqueda de empleo como AI Engineer. Reemplaza la firma visual heredada del portafolio original (tema oscuro, acento amarillo, nombre en contorno, montañas, fondo de puntos, cursor custom, carrusel) por un sistema claro y técnico tipo "plano de ingeniería", con un sismograma como motivo central (formación en Geofísica → IA). Añade un selector de idioma ES / EN para todo el contenido.

## Sobre los archivos de diseño
`Portafolio Final.dc.html` es una **referencia de diseño hecha en HTML**: muestra el aspecto y el comportamiento esperados, pero **no es código para copiar**. La tarea es **recrearlo dentro del codebase existente** con sus patrones: componentes en `src/components`, contenido en `src/data`, Tailwind 4 y Server Components por defecto. Para verlo, abre el archivo en un navegador (necesita `support.js` y `styles.css` en las rutas relativas incluidas).

**Conserva** del repo actual: la arquitectura de datos (`src/data/*.ts`), SEO/metadata, JSON-LD, `actions.ts` (Server Action con Resend + fallback mailto), validación en `lib/contact.ts`, skip link, `useSafeReducedMotion`, tests y CI. Solo cambia la capa visual y se agrega i18n.

## Fidelidad
**Alta fidelidad.** Colores, tipografía, espaciado y copy son finales. Hay que recrearlo con precisión usando Tailwind.

---

## Tokens de diseño (sistema "Industry")
Reemplaza el bloque `:root` / `@theme inline` de `src/app/globals.css`.

### Color
| Token | Hex | Uso |
|---|---|---|
| `--color-bg` | `#f2f2f3` | Fondo de la página |
| `--color-surface` | `#e9e9ea` | Fondo de los inputs |
| `--color-text` | `#1d1f20` | Texto principal |
| `--color-divider` | `#1d1f20` al 16 % (`color-mix(in srgb,#1d1f20 16%,transparent)`) | Bordes y filetes |
| filete suave | `#1d1f20` al 8 % | Separadores de filas |
| rejilla del sismograma | `#1d1f20` al 6 % | Cuadrícula del papel |
| `--color-accent` | `#5980a6` | Botón primario, conectores del diagrama |
| `--color-accent-100` | `#eef6ff` | Fondo del tag de magnitud |
| `--color-accent-700` | `#416180` | Texto en acento: kickers, cifras, links, traza |
| `--color-accent-800` | `#2c455d` | Hover de links, texto del tag de magnitud |
| `--color-accent-600` | `#597ea3` | Hover del botón primario |
| `--color-neutral-400` | `#b7b7ba` | Filete punteado del diagrama |
| `--color-neutral-500` | `#98989b` | Líneas S y marcas del eje de tiempo |
| `--color-neutral-700` | `#5d5d60` | Texto secundario y metadatos |
| `--color-neutral-800` | `#424244` | Párrafos de cuerpo |
| `--color-neutral-100` / `-800` | `#f5f5f8` / `#424244` | Tag neutral (fondo / texto) |

Esquema mono: el acento acero es el **único** color. El acento base (#5980a6) **no** se usa para texto pequeño; para eso va `accent-700`.

### Tipografía
- Títulos: **Barlow Condensed** 600, letter-spacing −0.015em (los títulos en mayúsculas usan +0.01em) y line-height 1.12 por defecto.
- Cuerpo: **Barlow** 400 / 500 / 700, 15–17px, line-height 1.55–1.6.
- Cárgalas con `next/font/google` (sustituyen a Archivo e IBM Plex Mono, que se eliminan).

| Rol | Tamaño / estilo |
|---|---|
| Nombre (h1 del hero) | `clamp(48px,6vw,80px)`, line-height .98, MAYÚSCULAS, 2 líneas ("Oscar" / "Hernández Terán") |
| Tagline del hero | Barlow Condensed 600, `clamp(26px,2.6vw,34px)`, lh 1.2 |
| Kicker de sección | 13px, 600, MAYÚSCULAS, tracking .08em, `accent-700`; formato `01 · Resultados` |
| Cifra grande | Barlow Condensed 600, 48px (resultados), 40px (caso destacado), 36px (tarjetas) |
| h2 del caso destacado | 36px, MAYÚSCULAS |
| h3 de proyecto | 21px |
| h3 de puesto | 28px |
| Categoría de habilidades | 19px, MAYÚSCULAS, tracking .02em |
| Título de contacto | `clamp(36px,4vw,52px)`, MAYÚSCULAS |
| Metadatos | 12–13px, `neutral-700` |

### Forma y espaciado
- **Radio 0 en todo**: tarjetas, botones, inputs y tags son cuadrados.
- Sin sombras en la página.
- Contenedor: `max-width:1440px`, padding horizontal `clamp(20px,5vw,72px)`.
- Separación entre secciones: 96px (72px entre el sismograma y Resultados).
- Cada sección abre con un kicker y debajo un filete de 1px en `--color-divider`, con 12–20px de aire antes del contenido.

### Marco "blueprint" (componente clave)
Tarjetas, figuras, el formulario y los botones primarios llevan:
- `position:relative; border:1px solid var(--color-divider)` y **sin fondo**.
- Cuatro cruces de registro "+" de 11×11px, colocadas en `top/left/right/bottom: -6px`.
- Cada cruz son dos líneas de 1px (`::before` vertical en `left:5px`, `::after` horizontal en `top:5px`) en `#1d1f20` al 55 %.

Crea un componente `<Blueprint as="div|article|figure|form">` que pinte las 4 esquinas. Las clases de referencia están en `ds/styles.css` (`.blueprint`, `.corner`).

### Botones
Base `.btn`: Barlow Condensed 600, 14px (16px en el hero y en CTAs), padding 10px 20px, borde 1px, `white-space:nowrap`.
- **Primario**: fondo `#5980a6`, texto `#f2f2f3`, borde `#5980a6`, cruces de registro. Hover `#597ea3`, activo `#416180`.
- **Secundario**: transparente, borde `--color-divider`. Hover: `#1d1f20` al 7 %.
- **Focus** (todos): `outline:2px solid #5980a6; outline-offset:2px`.

### Tags
11px, padding 3px 10px, radio 0, `white-space:nowrap`.
- **outline**: borde y texto `#5980a6`; para habilidades y stack.
- **neutral**: fondo `#f5f5f8`, texto `#424244`; para tags de proyecto.
- **accent**: fondo `#eef6ff`, texto `#2c455d`; para la magnitud del sismograma.

---

## Pantalla: página única (`src/app/page.tsx`)

### 1. Navbar (sticky)
- `position:sticky; top:0`, fondo `--color-bg` y borde inferior de 1px. Padding 16px vertical y el padding horizontal del contenedor.
- Orden:
  1. Marca "OSCAR HERNÁNDEZ TERÁN" (Barlow Condensed 600, 18px, MAYÚSCULAS, tracking .04em, `margin-right:auto`).
  2. Links de ancla: Proyectos · Experiencia · Habilidades · Contacto (14px; hover `accent`).
  3. Selector segmentado **ES | EN**.
  4. Botón primario "Descargar CV".
- Selector: borde 1px; cada opción con padding 7px 12px y 13px; la activa con fondo `#5980a6` y texto `#f2f2f3`.
- Se eliminan los iconos de LinkedIn y correo de la barra (pasan a Contacto) y el subrayado animado del link activo.

### 2. Hero (`#inicio`)
- Padding superior 88px. Grid de 2 columnas `repeat(auto-fit,minmax(min(100%,460px),1fr))`, gap `40px 64px`, `align-items:end`.
- **Columna izquierda:**
  - Kicker "AI Engineer · Veracruz, México · Remoto".
  - h1 con el nombre en 2 líneas.
  - CTAs: primario "Ver proyectos" (→ `#proyectos`) y secundario "Contactar" (→ `#contacto`).
- **Columna derecha:** tagline (`site.tagline`) y debajo la bio (`site.bio`, 16px, `neutral-800`).
- **Sin** subtítulo "Certificado…" en la bio: la certificación pasa a su propia tarjeta en Experiencia. En la referencia la bio termina en "…sistemas de IA.".

### 3. Sismograma (componente nuevo `Seismogram.tsx`; reemplaza `MountainSilhouette.tsx`)
Figura blueprint a todo el ancho, 56px bajo el hero.

- **Franja de cabecera** (borde inferior; 12px, 600, MAYÚSCULAS, tracking .08em; celdas con padding 10px 20px, separadas por bordes de 1px, `white-space:nowrap`, con wrap a nivel de celda):
  - "Sismograma de carrera" (flex:1, min 220px).
  - "Estación OHT · Veracruz, MX".
  - "Canal HHZ · vertical".
  - "100 sps".
- **Área de trazo**: grid `44px | 1fr`.
  - Columna izquierda: eje de amplitud con "+A" (top 44px), "0" (top 144px) y "−A" (top 244px), 11px `neutral-700`, alineados a la derecha, con borde derecho.
  - Área del gráfico: 300px de alto, con fondo de papel hecho de dos `repeating-linear-gradient` en `#1d1f20` al 6 %: verticales cada 2.5 % y horizontales cada 50px.
  - SVG con `viewBox="0 0 1300 300"`, `preserveAspectRatio="none"`, ancho 100 %.
  - Línea base horizontal en y=150 (`--color-divider`).
  - Trazo `path` sin relleno, en `accent-700`, 1.1px, `vector-effect:non-scaling-stroke`.
- **Generación del trazo**: determinista, sin aleatoriedad en runtime, para evitar errores de hidratación. Copia `buildTrace()` del archivo de referencia; puede vivir en `lib/seismogram.ts` y ejecutarse en un Server Component.
  - Ruido de fondo, más tres eventos.
  - En cada evento, una **onda P** (amplitud pequeña, alta frecuencia, decaimiento rápido) y 2.2 % después una **onda S** (mayor amplitud, menor frecuencia, coda larga).
  - Amplitudes 34 / 58 / 96: crecen con cada etapa.
- **Escala temporal**: de 2020.5 a 2026.5 (x = (año − 2020.5) / 6).
- **Marcas de fase** (líneas verticales discontinuas de 1px a toda la altura):

  | Evento | P (`accent-700`) | S (`neutral-500`) |
  |---|---|---|
  | UNAM (dic 2021) | 24.2 % | 26.4 % |
  | CBPI (jun 2022) | 32.5 % | 34.7 % |
  | Minsait (jul 2024) | 66.7 % | 68.9 % |

  - Etiquetas "P" y "S" en 12px bold, arriba (top 8px, a +4px de la línea), con el color de su línea.
- **Magnitudes**: tags accent "Mw 3.8", "Mw 5.1" y "Mw 6.7", abajo (bottom 10px), junto a la onda S de cada evento (3.8 en la P de UNAM). Son un recurso visual, no un dato real.
- **Eje de tiempo**: fila de 28px bajo el gráfico. Marcas de 6px y años 2021–2026 (11px) en 8.3 / 25 / 41.7 / 58.3 / 75 / 91.7 %.
- **Tabla de eventos** (borde superior; grid `auto-fit,minmax(220px,1fr)`; celdas con padding 14px 20px y borde derecho):
  - Código: 12px, 600, `accent-700`.
  - Rol: 15px, 500.
  - Organización: 13px, `neutral-700`.
  - Filas:
    - EV-01 · 2021 — Ingeniería Geofísica — UNAM
    - EV-02 · 2022 — Data Scientist — CBPI Consulting
    - EV-03 · 2024 — hoy — AI Engineer — Minsait – Indra Group
- **Pie de figura** (13px, `neutral-700`, máx. 90ch, 12px arriba): ver copy en la referencia.
- **Animación opcional**: dibujar el trazo de izquierda a derecha con `clip-path: inset(0 100% 0 0)` → `inset(0)`, 1.6s `cubic-bezier(.16,1,.3,1)`. Desactivada con reduced motion (reutiliza la lógica de `mountain-draw`).

### 4. Resultados (`#logros`, kicker "01 · Resultados")
- Grid `repeat(auto-fill,minmax(min(100%,190px),1fr))`.
- Bordes por celda: el contenedor lleva borde superior e izquierdo y cada celda borde derecho e inferior. **No** usar el truco de gap sobre fondo.
- Celda: padding 24px; cifra de 48px en `accent-700`; etiqueta de 14px en `neutral-800`.
- 5 métricas: 87.5 % · 97 % · 44 % · 20 % · 75 % (copy en la referencia).
- Nuevo archivo `src/data/metrics.ts`.

### 5. Proyectos (`#proyectos`, "02 · Proyectos"; reemplaza el carrusel y el modal)
- **Caso destacado**: `<article>` blueprint, padding 32px, grid 2 columnas `auto-fit,minmax(min(100%,420px),1fr)`, gap 40px. Muestra el proyecto con `featured: true` (el primero).
  - **Columna izquierda**, de arriba abajo:
    - Fila: kicker "Caso destacado · Sector retail" y, a la derecha, "Minsait · 2024–2026".
    - h2 con el título.
    - Descripción.
    - Fila de 3 cifras entre filetes superior e inferior, gap 36px: **4 h → 30 min** (por informe, en acento), **40** (usuarios de negocio), **5** (agentes).
    - Lista de `highlights` con guion "—" en acento (grid 16px | 1fr).
    - Tags outline del stack.
  - **Columna derecha**: etiqueta "Arquitectura del sistema" (12px, MAYÚSCULAS, `neutral-700`) y una caja con borde de 1px, padding 28px 24px y fondo de puntos (`radial-gradient` de 1px en `#1d1f20` al 12 %, cada 16px).
    - El diagrama se arma con divs, no con imagen:
      1. Caja "Usuario de negocio".
      2. Conector vertical de 1px × 20px en acento.
      3. Caja "Agente router" (borde en acento), con subtítulo "Google ADK · LangGraph · memoria en PostgreSQL" en 12px.
      4. Conector.
      5. Bracket: div con borde de 1px en acento sin borde inferior, `margin:0 16.6%`, 20px de alto.
      6. Grid de 3 cajas: "Agentic-RAG / Milvus · 5 colecciones", "Forecasting / SARIMAX · Prophet" y "Búsqueda web / Herramientas vía MCP".
      7. Al pie, filete punteado y "On-premise en Kubernetes" ↔ "Observabilidad en Grafana".
    - Todas las cajas llevan fondo `--color-bg` y `white-space:nowrap` en los títulos.
- **Otros 4 proyectos**: grid `auto-fit,minmax(min(100%,280px),1fr)`, gap 28px. Cada tarjeta es blueprint, con padding 22px y gap 10px:
  - Sector: 12px, MAYÚSCULAS, `neutral-700`.
  - Cifra: 36px en acento ("97 %", "−20 %", "−75 %", "ROI").
  - h3 con el título.
  - Descripción: 14px.
  - Tags neutral.
- Añade a `projects.ts` los campos `sector` (lo que hoy está en `period`) y `metric`.
- Se eliminan `ProjectModal.tsx` y `ProjectVisual.tsx` (o se dejan sin uso).

### 6. Experiencia (`#experiencia`, "03 · Experiencia")
- **Sin acordeón**: los logros se ven siempre.
- Cada puesto es un grid `auto-fit,minmax(min(100%,260px),1fr)`, gap `12px 48px`, padding 24px 0 32px, con filete inferior suave.
  - **Columna 1**: código "EV-03" / "EV-02" (vincula con el sismograma; 12px, 600, acento), h3 con el rol (28px), empresa (15px, 500) y periodo (13px, `neutral-700`).
  - **Columnas 2–3** (`grid-column:span 2`): resumen (16px) y lista de logros con guion en acento.
- La UNAM sale de la lista de puestos.
- Debajo, 2 tarjetas blueprint en grid: **Formación** (Ingeniería Geofísica · UNAM · 2021) y **Certificación** (Google Cloud Associate Cloud Engineer).
  - Kicker en acento, título Barlow Condensed 22px y metadato de 14px.

### 7. Habilidades (`#habilidades`, "04 · Habilidades")
- Grid `auto-fit,minmax(min(100%,300px),1fr)` con celdas separadas por filetes de 1px; el contenedor lleva borde.
- Cada celda: padding 22px, h3 de categoría y tags outline.
- Mismos datos de `skills.ts`.

### 8. Contacto (`#contacto`, "05 · Contacto")
- Grid de 2 columnas `auto-fit,minmax(min(100%,420px),1fr)`, gap `48px 72px`.
- **Izquierda**:
  - Título "HABLEMOS".
  - Copy nuevo, orientado a empleo: "Si tu equipo construye productos con LLMs, agentes o forecasting, me interesa conversar. Escríbeme y te respondo."
  - Links: correo, LinkedIn y "Descargar CV".
  - Ubicación "Veracruz, México · Remoto".
  - **No** se muestra disponibilidad.
- **Derecha**: `<form>` blueprint, padding 28px.
  - Fila con Nombre y Email; debajo Mensaje (textarea de 5 filas).
  - Botón primario "Enviar mensaje".
  - Inputs: fondo `#e9e9ea`, borde de 1px, radio 0, min-height 36px, padding 6px 10px, 14px. Label de 12px al 70 % de opacidad.
  - Hover: borde al 45 %. Focus: borde en acento.
- Mantén toda la lógica actual de `ContactForm.tsx` (Server Action, honeypot, errores `aria-*`); solo cambian los estilos.

### 9. Footer
- Filete superior, 96px de margen arriba, padding 24px 0 40px, 13px `neutral-700`.
- Contenido: "© 2026 Oscar Hernández Terán" a la izquierda y "De señales sísmicas a sistemas multiagente." a la derecha.

---

## Eliminar
- `CustomCursor.tsx` y sus clases en `globals.css`.
- `DotBackground.tsx` y las variables `--spot-x` / `--spot-y` en `page.tsx`.
- `MountainSilhouette.tsx` y los keyframes `mountain-*`. La lógica de `mountain-draw` se reutiliza para el trazo si se anima.
- Archivo e IBM Plex Mono.
- El gradiente radial del `body`.
- `themeColor` en `layout.tsx`: pasa a `#f2f2f3` y `color-scheme: light`.

## Interacciones y comportamiento
- **Idioma ES / EN**: el selector cambia todo el contenido.
  - Recomendación: rutas `/es` y `/en` con `[locale]` en el App Router, para SEO, `hreflang` y metadata y OG por idioma. Alternativa más simple: estado en cliente con un `LanguageContext` guardado en `localStorage`.
  - Idioma por defecto: `es`.
  - Actualiza `<html lang>`, metadata y JSON-LD por idioma.
- **Contenido bilingüe**: convertir cada string de `src/data/*.ts` a `{ es, en }`, o tener `data/es/*` y `data/en/*`. Todas las traducciones al inglés están en el objeto `DICT.en` del archivo de referencia.
- **Navegación**: anclas con `scroll-behavior:smooth` (desactivado con reduced motion) y `scroll-margin-top:80px` en cada sección para compensar el navbar sticky.
- **Hover**: links en `accent-800`; botones según la sección "Botones".
- **Animaciones**: si se mantienen las entradas con `Reveal`, que sean sutiles (fade + 12px). Respetar `useSafeReducedMotion`.
- **Responsive**: todos los grids usan `auto-fit` / `minmax` y se apilan solos. En móvil el navbar hace wrap; valorar ocultar los links de ancla por debajo de 480px y dejar solo la marca, el selector y el CV. El sismograma escala con `preserveAspectRatio="none"` y mantiene 300px de alto.

## Estado
- `lang: 'es' | 'en'`.
- Se quita el estado del carrusel, del modal y del acordeón.

## Assets
- No hay imágenes. El diagrama y el sismograma son HTML y SVG generados.
- Iconos (si se agregan): Lucide con `strokeWidth={1.5}`.
- El CV sigue en `/CV_Oscar_Hernandez_Teran.pdf`; considera añadir una versión en inglés.

## Archivos
- `Portafolio Final.dc.html`: la referencia de diseño. La lógica (`DICT` con todo el copy ES/EN, `buildTrace()`) está en el `<script>` del final.
- `ds/styles.css`: tokens y clases del sistema Industry (fuente de verdad de los valores).
- `support.js`: runtime necesario para abrir la referencia en el navegador; no es parte de la implementación.
