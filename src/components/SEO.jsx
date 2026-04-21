import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'Fertilidad a Tu Lado'
const SITE_URL  = 'https://fertilidadatulado.com'
const OG_IMAGE  = `${SITE_URL}/og-image.jpg`

export default function SEO({
  title,
  description,
  canonical,
  type = 'website',
  image = OG_IMAGE,
}) {
  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} | Enfermera especialista en reproducción asistida`

  const url = canonical ? `${SITE_URL}${canonical}` : SITE_URL

  return (
    <Helmet>
      {/* Básicos */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type"        content={type} />
      <meta property="og:url"         content={url} />
      <meta property="og:title"       content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image"       content={image} />
      <meta property="og:locale"      content="es_ES" />
      <meta property="og:site_name"   content={SITE_NAME} />

      {/* Twitter */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image"       content={image} />
    </Helmet>
  )
}
