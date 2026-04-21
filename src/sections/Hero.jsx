import { Heart } from 'lucide-react'
import { useSiteSettings } from '../hooks/useSiteSettings'

const HERO_IMAGE_FALLBACK =
  'https://images.unsplash.com/photo-1763106377335-578cf40ce82e?w=1920&h=820&q=85&auto=format&fit=crop'

export default function Hero() {
  const { settings } = useSiteSettings()
  const heroImage  = settings.hero_image_url || HERO_IMAGE_FALLBACK
  const darkness   = (parseInt(settings.hero_darkness  ?? '45') / 100).toFixed(2)
  const rose       = (parseInt(settings.hero_rose      ?? '35') / 100).toFixed(2)
  const posX       = settings.hero_pos_x ?? '56'
  const posY       = settings.hero_pos_y ?? '42'

  const scrollToContact = () => {
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        backgroundImage: `url(${heroImage}), linear-gradient(135deg, #A55A6E 0%, #C9788A 38%, #E09AAA 72%, #F2C8D0 100%)`,
        backgroundSize: 'cover',
        backgroundPosition: `${posX}% ${posY}%`,
        backgroundBlendMode: 'normal',
      }}
    >
      {/* Overlay oscuridad — controlado desde panel privado */}
      <div className="absolute inset-0" style={{ background: `rgba(0,0,0,${darkness})` }} />
      {/* Gradiente lateral derecho */}
      <div className="absolute inset-0 bg-gradient-to-l from-black/55 via-black/15 to-transparent" />
      {/* Tono rosa — controlado desde panel privado */}
      <div className="absolute inset-0" style={{ background: `rgba(165,90,110,${rose})` }} />
      {/* Gradiente vertical suave */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/45" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full py-12 pb-28 pt-[calc(5.5rem+env(safe-area-inset-top))] md:py-16 md:pt-[calc(6.5rem+env(safe-area-inset-top))] md:pb-32 flex items-center justify-center min-h-screen text-center">
        <div className="max-w-3xl w-full flex flex-col items-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-black/35 backdrop-blur-sm border border-white/25 rounded-full px-4 py-1.5 mb-6 shadow-[0_4px_24px_rgba(0,0,0,0.35)]">
            <Heart size={13} className="text-rose-soft fill-rose-soft" />
            <span className="text-sm font-medium text-white">Asesora especializada en fertilidad</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight mb-6 [text-shadow:0_2px_28px_rgba(0,0,0,0.75),0_1px_4px_rgba(0,0,0,0.9)]">
            <span className="text-white">Entiende tu ciclo.</span>
            <br />
            <span className="text-rose-soft [text-shadow:0_2px_24px_rgba(0,0,0,0.8),0_0_20px_rgba(0,0,0,0.5)]">Acompaña tu proceso.</span>
            <br />
            <span className="text-white">Con respuestas, no silencios.</span>
          </h1>

          <p className="text-white/95 text-base md:text-lg leading-relaxed mb-10 max-w-xl [text-shadow:0_2px_16px_rgba(0,0,0,0.65)]">
            Entender tu cuerpo es el primer paso para vivir la búsqueda de embarazo con más claridad y tranquilidad. Buscar un embarazo no debería vivirse a ciegas ni en soledad.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center w-full sm:w-auto">
            <button
              onClick={scrollToContact}
              className="inline-flex items-center justify-center gap-2 bg-rose-accent hover:bg-rose-dark text-white font-medium px-8 py-3.5 rounded-full transition-all duration-200 hover:shadow-lg active:scale-95"
            >
              Quiero hablar contigo
              <Heart size={16} className="fill-white text-white shrink-0" />
            </button>
            <button
              onClick={() => document.getElementById('sobre-mi')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-rose-soft/15 border border-rose-soft/85 text-white font-medium px-8 py-3.5 rounded-full transition-all duration-200 active:scale-95"
            >
              Conóceme
            </button>
          </div>

          {/* Teaser guía gratuita */}
          <button
            onClick={() => document.getElementById('guia-gratuita')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-2 mt-2 transition-opacity duration-200 hover:opacity-80 active:scale-95"
          >
            <span className="text-xl">🎁</span>
            <span className="text-white/75 text-sm underline underline-offset-2 decoration-white/40">
              ¿Primera vez aquí? Descarga mi guía gratuita sobre fertilidad
            </span>
          </button>
        </div>
      </div>
    </section>
  )
}
