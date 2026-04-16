# Fertilidad a Tu Lado

Sitio web para **Lidia**: asesoría en fertilidad y reproducción asistida. Stack moderno, diseño cálido alineado con la identidad del proyecto (paleta rosa / crema del logo).

## Stack

- **React 19** + **Vite 8**
- **React Router** (páginas legales y home)
- **Tailwind CSS** (paleta extendida en `tailwind.config.js`)
- **Lucide React** (iconos)
- Fuentes: **Inter** + **Lora** (Google Fonts)

## Estructura principal

```
src/
├── App.jsx              # Rutas
├── components/          # Header, Footer
├── pages/               # Home, Aviso legal, Privacidad, Cookies
└── sections/            # Hero, About, Services, HowItWorks, Testimonials, Contact
```

## Qué incluye el proyecto

- **Hero** a pantalla completa: imagen de fondo (Unsplash, pareja / embarazo, tono cálido), velos con **tinte rosa de marca** (`rose-dark`, `rose-accent`, `rose-soft`), titular centrado y espaciado para header fijo y móvil.
- **Eslogan** en tres líneas: *Entiende tu ciclo* / *Acompaña tu proceso* / *Con respuestas, no silencios*, con CTA *Quiero hablar contigo* y *Conóceme* (scroll a “Sobre mí”).
- **Sobre mí**, **Servicios**, **Cómo funciona**, **Testimonios**, **Contacto** con formulario (mensaje de éxito) y tarjetas lateral (Instagram con etiqueta correcta, email).
- **Footer** con enlaces y contacto; **Header** fijo con navegación ancla.
- **Páginas legales** (aviso legal, privacidad, cookies) con placeholders para datos reales.
- **Paleta unificada**: `cream`, `rose-soft`, `rose-accent`, `rose-dark`, etc., coherente entre hero y resto de secciones.
- **Contact / Instagram**: uso del icono `AtSign` de Lucide (la versión de `lucide-react` del proyecto no exporta `Instagram`); texto “Instagram” como etiqueta. Tras cambios de imports, conviene borrar caché de Vite (`node_modules/.vite`) si el dev server muestra errores antiguos.

## Imágenes

- **Hero**: foto apaisada desde [Unsplash](https://unsplash.com) (crédito a la autora en la ficha de la foto; enlazar atribución en producción según licencia Unsplash).
- **Sobre mí**: puede haber un **placeholder** de desarrollo sustituible por foto real antes de producción.

## Scripts

```bash
npm install
npm run dev      # desarrollo — http://localhost:5173
npm run build    # producción → dist/
npm run preview  # vista previa del build
npm run lint
```

## Repositorio y despliegue

- Código en **GitHub**; despliegue recomendable con **Vercel** (u otro) conectado al mismo repositorio y rama de producción (p. ej. `main`), para que cada `git push` dispare un nuevo deploy.

## Notas legales de contenido

Sustituir en las páginas legales y de contacto los marcadores `[apellidos]`, `[NIF]`, etc., cuando haya datos definitivos.

---

Proyecto generado inicialmente con la plantilla Vite + React y evolucionado para el sitio de Fertilidad a Tu Lado.
