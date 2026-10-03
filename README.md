# Portfolio — Oscar Hernández Terán

Portfolio personal de un AI Engineer: proyectos profesionales, experiencia, habilidades y contacto.

Basado en el portfolio de [Pedro Adair Gallegos](https://github.com/adather/portfolio).

**Stack:** Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion · Docker / Cloud Run

## Desarrollo local

```bash
npm install
cp .env.example .env.local   # opcional, ver "Variables de entorno"
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

| Script              | Qué hace                                 |
| ------------------- | ---------------------------------------- |
| `npm run dev`       | Servidor de desarrollo                   |
| `npm run build`     | Build de producción (standalone)         |
| `npm run start`     | Sirve el build                           |
| `npm run lint`      | ESLint                                   |
| `npm run typecheck` | Chequeo de tipos de TypeScript           |
| `npm test`          | Tests unitarios y e2e (Playwright)       |
| `npm run test:ui`   | Tests en modo interactivo                |

## Variables de entorno

| Variable               | Uso                                                                                                   |
| ---------------------- | ----------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | URL canónica para metadata, Open Graph y sitemap. Se inyecta **en build**.                            |
| `RESEND_API_KEY`       | Envío del formulario de contacto con [Resend](https://resend.com). Sin ella, el form abre `mailto:`.  |
| `CONTACT_TO_EMAIL`     | Destinatario (por defecto, el email de `site.ts`).                                                     |
| `CONTACT_FROM_EMAIL`   | Remitente verificado en Resend (por defecto, el remitente de pruebas `onboarding@resend.dev`).         |

## Tests y CI

Los tests usan [Playwright](https://playwright.dev) y corren contra el **build de producción** en el puerto 3100, para no chocar con `npm run dev`:

- `tests/unit/`: la validación del formulario de contacto (lógica pura, sin navegador).
- `tests/e2e/`: la página real en escritorio y móvil. Cubren el render sin errores de consola ni de hidratación, la navegación del modal con teclado y la restauración del foco, el acordeón de experiencia, los errores y el fallback del formulario, el modo de movimiento reducido, el overflow en móvil, la metadata (SEO, Open Graph, JSON-LD), `robots.txt`, `sitemap.xml` y la 404.

La primera vez: `npx playwright install chromium`.

En cada push y pull request, [GitHub Actions](.github/workflows/ci.yml) ejecuta lint → typecheck → build → tests. Si algo falla, sube el reporte de Playwright como artifact.

## Estructura

```
src/
  app/
    layout.tsx            fuentes, metadata SEO/Open Graph, JSON-LD (Person), skip link
    page.tsx              composición de secciones
    actions.ts            Server Action del formulario de contacto (Resend)
    opengraph-image.tsx   imagen para compartir generada con next/og
    icon.tsx              favicon generado
    robots.ts, sitemap.ts
  components/             secciones (Hero, Projects, Experience…) y piezas compartidas
  data/                   todo el contenido editable, separado de la UI
  lib/                    hooks y utilidades (validación de contacto, estilos de botón, reduced motion)
```

## Decisiones técnicas

- **Contenido como datos.** Textos, proyectos y experiencia viven en `src/data/`, tipados; los componentes no tienen copy hardcodeado.
- **Formulario con Server Action.** La validación está en `lib/contact.ts` y la comparten cliente y servidor: el cliente evita round-trips innecesarios y el servidor vuelve a validar. Incluye honeypot anti-spam y rate limit por IP (best-effort, por instancia). Si no hay proveedor configurado, cae a `mailto:` para no romperse.
- **Accesibilidad.** Respeta `prefers-reduced-motion` en todas las animaciones sin romper la hidratación (`useSafeReducedMotion`), modal con focus trap y restauración de foco, navegación por teclado, skip link y estados `aria-*` en el formulario.
- **Rendimiento.** Server Components por defecto; solo las piezas interactivas son client components. Las visualizaciones son SVG inline, sin imágenes pesadas.

## Deploy

El proyecto compila en modo `standalone` y trae un `Dockerfile` multi-stage listo para Google Cloud Run (escucha en `PORT`, por defecto 8080). Recuerda pasar `NEXT_PUBLIC_SITE_URL` como build arg/variable al construir la imagen.
