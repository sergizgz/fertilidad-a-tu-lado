# Fertilidad a Tu Lado

Sitio web profesional para **Lidia**, enfermera especialista en reproducción asistida con +15 años de experiencia. Ofrece asesoramiento personalizado en fertilidad de forma online.

🌐 **Producción**: [fertilidadatulado.vercel.app](https://fertilidadatulado.vercel.app)  
🔒 **Panel privado**: [fertilidadatulado.vercel.app/privado](https://fertilidadatulado.vercel.app/privado)  
📦 **Repositorio**: [github.com/sergizgz/fertilidadatulado](https://github.com/sergizgz/fertilidadatulado)

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19 + Vite + React Router v7 |
| Estilos | Tailwind CSS v3 (paleta extendida) |
| Backend | Vercel Serverless Functions (`/api`) |
| Base de datos | Supabase (PostgreSQL + Auth + Storage) |
| Email | Resend |
| Deploy | Vercel (auto-deploy en push a `main`) |

---

## Estructura del proyecto

```
fertilidad-a-tu-lado/
├── api/                        # Serverless functions (Vercel)
│   ├── contact.js              # Guarda solicitud + envía 2 emails
│   ├── submissions.js          # GET solicitudes (auth requerida)
│   ├── update-submission.js    # PATCH estado/notas (auth requerida)
│   ├── delete-submission.js    # DELETE solicitud (auth requerida)
│   ├── subscribe.js            # POST suscripción al ebook
│   ├── subscribers.js          # GET suscriptores (auth requerida)
│   ├── delete-subscriber.js    # DELETE suscriptor (auth requerida)
│   └── ebook.js                # Sirve el PDF con nombre correcto
│
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Navbar fijo, links dinámicos por visibilidad
│   │   ├── Footer.jsx
│   │   ├── SEO.jsx             # Helmet wrapper
│   │   ├── BlogCard.jsx
│   │   └── blog/
│   │       ├── PostList.jsx
│   │       └── PostEditor.jsx  # Editor Tiptap (WYSIWYG)
│   │
│   ├── sections/               # Secciones de la home
│   │   ├── Hero.jsx            # Portada con imagen y textos editables
│   │   ├── About.jsx           # Conóceme (bio + foto desde site_settings)
│   │   ├── Services.jsx        # Tarjetas de servicios (dinámicas)
│   │   ├── HowItWorks.jsx      # Pasos del proceso
│   │   ├── Testimonials.jsx
│   │   ├── LeadMagnet.jsx      # Descarga del ebook
│   │   ├── BlogPreview.jsx     # Preview de artículos recientes
│   │   └── Contact.jsx         # Formulario → POST /api/contact
│   │
│   ├── pages/
│   │   ├── Home.jsx            # Renderiza secciones según visibilidad
│   │   ├── Privado.jsx         # Panel privado completo
│   │   ├── Blog.jsx
│   │   ├── BlogPost.jsx
│   │   ├── AvisoLegal.jsx
│   │   ├── Privacidad.jsx
│   │   └── Cookies.jsx
│   │
│   ├── hooks/
│   │   └── useSiteSettings.js  # Lee site_settings con caché en memoria
│   │
│   └── lib/
│       └── supabase.js         # Cliente Supabase (anon key, solo frontend)
│
├── public/
│   └── ebook.pdf               # Fallback local del ebook
│
├── vercel.json                 # Rewrites, headers de seguridad, noindex /privado
└── tailwind.config.js          # Paleta de colores extendida
```

---

## Funcionalidades

### Web pública
- **Home** con 8 secciones independientes, cada una activable/desactivable desde el panel privado
- **Blog** con editor WYSIWYG (Tiptap), imágenes, SEO por artículo
- **Lead magnet**: formulario de suscripción → guarda email en Supabase → descarga automática del ebook en PDF
- **Formulario de contacto**: guarda en Supabase y envía email a Lidia y confirmación al usuario
- **SEO**: meta tags dinámicos, canonical, Open Graph, robots

### Panel privado (`/privado`)
Acceso por email/contraseña vía Supabase Auth. Cierre automático por inactividad a las 2 horas.

| Sección | Descripción |
|---------|-------------|
| **Resumen** | KPIs: total solicitudes, pendientes, suscriptores |
| **Solicitudes** | Tabla de contactos con estado, notas internas, exportación Excel |
| **Suscriptores** | Lista de emails suscritos al ebook |
| **Blog** | Crear, editar y publicar artículos |
| **Servicios** | Gestión dinámica de los servicios que aparecen en la web |
| **Portada** | Editar todos los textos del Hero + imagen de fondo |
| **Biografía** | Editar párrafos, hitos de CV, años de experiencia y foto |
| **Estructura** | Activar/desactivar cada sección de la home (y del menú de navegación) |

---

## Base de datos (Supabase)

### Tablas principales

**`contact_submissions`**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | uuid PK | |
| name | text | |
| email | text | |
| service | text | Servicio solicitado |
| message | text | |
| status | text | `pendiente` / `en_contacto` / `atendido` / `descartado` |
| notes | text | Notas internas de Lidia |
| created_at | timestamptz | |

**`subscribers`**
| Campo | Tipo |
|-------|------|
| id | uuid PK |
| email | text UNIQUE |
| created_at | timestamptz |

**`services`**
| Campo | Tipo |
|-------|------|
| id | uuid PK |
| title | text |
| description | text |
| icon | text |
| active | boolean |
| sort_order | int |

**`site_settings`** — CMS clave/valor para todos los textos y configuración editables
| Ejemplos de claves |
|--------------------|
| `hero_title_1`, `hero_title_2`, `hero_title_3` |
| `hero_badge`, `hero_subtitle`, `hero_cta_primary` |
| `hero_image_url`, `hero_image_*_visible` |
| `bio_paragraphs` (JSON), `bio_credentials` (JSON), `bio_years` |
| `lidia_photo_url`, `ebook_pdf_url` |
| `section_about_visible`, `section_services_visible`, … |

**`blog_posts`**
| Campo | Tipo |
|-------|------|
| id | uuid PK |
| title | text |
| slug | text UNIQUE |
| content | text (HTML) |
| excerpt | text |
| cover_url | text |
| published | boolean |
| published_at | timestamptz |

> RLS habilitado en todas las tablas. Las API routes usan `SUPABASE_SERVICE_ROLE_KEY` para saltarse RLS de forma controlada.

---

## Variables de entorno

Crear `.env.local` en la raíz (nunca subir a git):

```env
# Servidor (api/)
RESEND_API_KEY=re_...
SUPABASE_URL=https://sjwaansygeagnmepfheg.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Cliente (src/ — se exponen al navegador)
VITE_SUPABASE_URL=https://sjwaansygeagnmepfheg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

Todas están también configuradas en **Vercel → Settings → Environment Variables** (Production).

---

## Desarrollo local

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # build de producción → dist/
npm run preview   # previsualizar el build
```

> Las API routes (`/api/*`) solo funcionan en Vercel. En local, el formulario de contacto y la suscripción al ebook no enviarán emails ni guardarán en Supabase, pero el frontend carga correctamente con las variables de entorno.

---

## Deploy

```
git push origin main  →  Vercel detecta el push  →  build automático  →  fertilidadatulado.vercel.app
```

El proyecto también tiene un alias antiguo `fertilidad-a-tu-lado2.vercel.app` que **no recibe deploys** y debe ignorarse.

---

## Paleta de colores

```js
cream:         '#FEF9FA'   // fondo general
cream-dark:    '#F7EAED'
cream-darker:  '#EDD5DC'
rose-soft:     '#F2C8D0'
rose-medium:   '#E09AAA'
rose-accent:   '#C9788A'   // color principal de marca
rose-dark:     '#A55A6E'
```

Fuentes: **Inter** (sans-serif) + **Lora** (serif) vía Google Fonts.

---

## Pendiente

- [ ] Sustituir foto placeholder de Lidia en `About.jsx` por foto real
- [ ] Verificar dominio `fertilidadatulado.es` en Resend y actualizar FROM/TO en `api/contact.js`
- [ ] Cambiar contraseña del área privada desde Supabase Auth
- [ ] Rellenar contenido real en páginas legales (NIF de Lidia, dirección, etc.)
- [ ] Añadir testimonios reales en `Testimonials.jsx`
