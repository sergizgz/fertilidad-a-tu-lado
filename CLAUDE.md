# Fertilidad a Tu Lado — Contexto del proyecto

## Descripción
Web para **Lidia**, enfermera especialista en reproducción asistida con +15 años de experiencia. Ofrece asesoramiento personalizado en fertilidad de forma online.

## Stack
- **Frontend**: Vite + React 19 + Tailwind CSS v3 + React Router v7
- **Backend**: Vercel Serverless Functions (`/api`)
- **Base de datos**: Supabase (PostgreSQL)
- **Email**: Resend
- **Deploy**: GitHub → Vercel (automático en push a `main`)

## URLs
- **Producción**: https://fertilidadatulado.vercel.app
- **Repositorio**: https://github.com/sergizgz/fertilidadatulado
- **Supabase**: https://sjwaansygeagnmepfheg.supabase.co
- **Área privada**: https://fertilidadatulado.vercel.app/privado

> ⚠️ NO usar `fertilidad-a-tu-lado2.vercel.app` — es el proyecto antiguo, no recibe deploys.

## Estructura de archivos clave
```
src/
  components/
    Header.jsx        # Navbar fijo, siempre opaco, logo SVG tulipán
    Footer.jsx
  sections/
    Hero.jsx          # Hero full-viewport con imagen de fondo
    About.jsx         # Sección sobre Lidia (foto placeholder — sustituir)
    Services.jsx
    HowItWorks.jsx
    Testimonials.jsx
    Contact.jsx       # Formulario → POST /api/contact
  pages/
    Home.jsx
    Privado.jsx       # Dashboard privado con login Supabase Auth
    AvisoLegal.jsx
    Privacidad.jsx
    Cookies.jsx
  lib/
    supabase.js       # Cliente Supabase (anon key, solo frontend)

api/
  contact.js          # Guarda en Supabase + envía 2 emails con Resend
  submissions.js      # GET submissions (protegido por sesión)
  update-submission.js # PATCH status/notes (protegido por sesión)
```

## Paleta de colores (tailwind.config.js)
```
cream:        #FEF9FA
cream-dark:   #F7EAED
cream-darker: #EDD5DC
rose-soft:    #F2C8D0
rose-medium:  #E09AAA
rose-accent:  #C9788A   ← color principal de marca
rose-dark:    #A55A6E
```
Fuentes: **Inter** (sans) + **Lora** (serif) vía Google Fonts.

## Supabase
- **Proyecto ID**: `sjwaansygeagnmepfheg`
- **Tabla principal**: `contact_submissions`
  - `id` uuid PK
  - `name` text
  - `email` text
  - `service` text (preconcepcion / fiv / consulta / otro)
  - `message` text
  - `status` text default 'pendiente' (pendiente / en_contacto / atendido / descartado)
  - `notes` text nullable
  - `created_at` timestamptz
- **Auth**: usuario de Lidia creado en Supabase Auth → `hola@fertilidadatulado.es`
- RLS habilitado; solo `service_role` escribe/lee desde las API routes

## Variables de entorno
En `.env.local` (nunca subir a git):
```
RESEND_API_KEY=...
SUPABASE_URL=https://sjwaansygeagnmepfheg.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...    ← solo en servidor (api/)
VITE_SUPABASE_URL=...            ← expuesta al frontend
VITE_SUPABASE_ANON_KEY=...       ← expuesta al frontend
```
Todas están también configuradas en Vercel → Environment Variables (Production).

## Emails (Resend)
- **From**: `Fertilidad a Tu Lado <onboarding@resend.dev>` (cambiar cuando se verifique el dominio `fertilidadatulado.es`)
- **Destino Lidia**: `sergiociria2@gmail.com` (temporal hasta tener dominio verificado)
- **Destino usuario**: `sergiociria2@gmail.com` (ídem)
- Cuando el dominio esté verificado, cambiar ambos en `api/contact.js`

## Área privada `/privado`
- Login con email/password via Supabase Auth
- Dashboard con sidebar: **Resumen** (stats) y **Solicitudes** (tabla)
- Cada solicitud tiene: estado editable inline, notas internas, exportación a Excel
- Preparado para añadir nuevas secciones (Descargas, Planes, etc.) en `NAV_ITEMS`

## Flujo de deploy
```
git push origin main → GitHub → Vercel build automático → fertilidadatulado.vercel.app
```

## Pendiente para producción
- [ ] Sustituir foto placeholder de Lidia en `About.jsx`
- [ ] Verificar dominio `fertilidadatulado.es` en Resend y actualizar FROM/TO en `api/contact.js`
- [ ] Cambiar contraseña del área privada desde Supabase Auth
- [ ] Rellenar contenido real: testimonios, precios, texto legal con NIF de Lidia
