import { useState } from 'react'
import { Download, CheckCircle, ArrowRight, Sparkles } from 'lucide-react'

const BENEFITS = [
  'Los 4 errores que retrasan el embarazo sin que te lo hayan explicado',
  'Por qué ovular no es suficiente y qué más influye en la concepción',
  'Factores invisibles que afectan tu fertilidad (y cómo actuar sobre ellos)',
  'Qué puedes empezar a hacer desde hoy, de forma práctica y sin agobios',
]

export default function LeadMagnet() {
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [pdfUrl, setPdfUrl]   = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email) return

    setLoading(true)
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error desconocido')
      setPdfUrl(data.pdfUrl)
    } catch (err) {
      setError(err.message || 'Algo ha fallado. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="guia-gratuita" className="py-0 overflow-hidden">
      <div
        className="relative"
        style={{
          background: 'linear-gradient(135deg, #2d0e1a 0%, #5a2035 40%, #8f4560 75%, #a55a6e 100%)',
        }}
      >
        {/* Decos de fondo */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-10"
               style={{ background: 'radial-gradient(circle, #F2C8D0, transparent)' }} />
          <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full opacity-10"
               style={{ background: 'radial-gradient(circle, #C9788A, transparent)' }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-5 py-20 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">

            {/* ── LIBRO 3D ── */}
            <div className="flex justify-center order-2 md:order-1">
              <div className="relative" style={{ perspective: '900px' }}>
                {/* Reflejo / sombra en el suelo */}
                <div
                  className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-72 h-8 opacity-40 blur-xl rounded-full"
                  style={{ background: 'rgba(0,0,0,0.7)' }}
                />

                {/* Libro */}
                <div
                  className="flex"
                  style={{
                    transform: 'perspective(900px) rotateY(-18deg) rotateX(4deg)',
                    filter: 'drop-shadow(24px 24px 50px rgba(0,0,0,0.6))',
                    transition: 'transform 0.4s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'perspective(900px) rotateY(-6deg) rotateX(2deg)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'perspective(900px) rotateY(-18deg) rotateX(4deg)'}
                >
                  {/* Lomo */}
                  <div
                    className="flex-shrink-0"
                    style={{
                      width: '30px',
                      height: '400px',
                      background: 'linear-gradient(180deg, #1e0810 0%, #4a1a2c 50%, #6b2c3f 100%)',
                      borderRadius: '5px 0 0 5px',
                    }}
                  />

                  {/* Portada */}
                  <div
                    style={{
                      width: '280px',
                      height: '400px',
                      borderRadius: '0 5px 5px 0',
                      overflow: 'hidden',
                      position: 'relative',
                      background: 'linear-gradient(160deg, #3d1520 0%, #6b2c3f 40%, #8f4560 70%, #a55a6e 100%)',
                    }}
                  >
                    {/* Foto de fondo */}
                    <img
                      src="/portada-ebook2.png"
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover object-top"
                      onError={e => { e.target.style.display = 'none' }}
                    />


                    {/* Contenido portada */}
                    <div className="absolute inset-0 p-5 flex flex-col justify-between z-10">
                      {/* Logo + marca arriba */}
                      <div>
                        <svg width="30" height="26" viewBox="0 0 992 864" fill="rgba(242,200,208,0.85)" xmlns="http://www.w3.org/2000/svg">
                          <path d="m 466.6,234 c -48,8 -88.6,30.8 -121.4,68.1 -15.7,17.7 -29.3,41.1 -38,64.9 -7.6,20.9 -10.9,38.2 -11.9,62 -2.2,55.8 20.1,111.8 60.6,152.1 18.1,18 34.4,29.4 55.9,39.3 16.5,7.5 25.1,9.7 37.2,9.7 16.6,0 24.1,-3.2 35.1,-14.9 9.6,-10.1 15.7,-21.8 19.9,-38 2.8,-11.1 3.9,-19.5 5,-38.7 0.5,-9.4 1.6,-19.7 2.5,-23 3.7,-14.3 12.5,-26.1 24.2,-32.2 3.2,-1.7 11.8,-5.2 19.2,-7.8 23.1,-8 31.1,-12.5 46.3,-25.9 18.5,-16.3 30.5,-36.1 35.8,-58.9 2.6,-11.2 2.4,-24.9 -0.4,-32.7 -3.4,-9.3 -11.9,-17.3 -22,-20.6 -3.7,-1.3 -7.6,-1.5 -17.5,-1.2 -12.1,0.4 -13.3,0.6 -28,5.7 -8.4,2.8 -15.5,5.1 -15.6,4.9 -0.1,-0.2 -1.9,-4.1 -3.9,-8.8 -11.3,-26.3 -28.6,-42.7 -46.3,-43.8 -21.1,-1.4 -43.1,17.1 -53.9,45.3 -1.9,5 -3.4,7.5 -4.5,7.5 -0.8,0 -4.3,-1.1 -7.6,-2.4 -3.3,-1.4 -10.7,-3.7 -16.4,-5.2 -13.7,-3.6 -30.3,-3.8 -39,-0.5 -10.6,4 -17.7,12.5 -21.4,25.6 -2.7,9 -1.6,19.5 3.6,35 5.9,17.9 12.1,27.6 27.9,43.5 18.7,18.9 30.3,25.8 60.5,36.1 17.5,5.9 20.9,7.4 28.8,12.7 5.5,3.6 11.3,12.3 14,20.6 2,6.4 2.2,9 2,25.1 -0.1,19 -1.2,26.7 -5.9,42.5 -5.2,17.1 -14.9,30.7 -25.9,36.1 -4.4,2.1 -6.3,2.4 -16.5,2.4 -13.8,-0.1 -17.8,-1.3 -38.5,-11.6 -16.2,-8 -28.1,-16.2 -41.3,-28.5 -20.1,-18.7 -40,-48 -49.5,-73 -18.3,-47.9 -17.5,-96.2 2.4,-144.6 3.5,-8.5 16.6,-31.9 22.3,-39.8 10,-13.8 24,-27.2 46.3,-44.3 7.3,-5.6 27.2,-16.2 38.8,-20.7 28.6,-11 64.2,-15.5 93.5,-11.6 14,1.9 37,7.8 49.6,12.7 32.1,12.6 66.7,41 86.9,71.4 16,24.1 26.9,51.8 31,79 2.2,14.9 2,43.9 -0.5,59 -4,24.4 -12.8,48.7 -25.1,69.1 -8.4,13.9 -14.4,21.7 -26.5,34.4 -36.4,37.9 -86.8,59.8 -137.9,60 -9.2,0.1 -11.5,1.2 -11.5,5.8 0,5 2.1,5.5 20.4,4.9 24.8,-0.8 40.5,-4.2 65.4,-14.1 46.8,-18.8 85.8,-55.1 107.7,-100.1 20.4,-42 26.2,-87.3 17,-132.5 -6.4,-31.6 -20.6,-61.4 -41.4,-87.2 -10.2,-12.7 -32.4,-32.8 -46.3,-41.9 -25.4,-16.7 -47.5,-24.8 -86.4,-31.8 -9.7,-1.8 -46,-1.2 -58.8,0.9 z"/>
                        </svg>
                        <p style={{ fontSize: '10px', color: 'rgba(242,200,208,0.7)', marginTop: '4px', lineHeight: 1.3, fontFamily: 'serif' }}>
                          Fertilidad a Tu Lado
                        </p>
                      </div>

                      <div>
                        <p style={{ fontSize: '10px', color: 'white', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 700, textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
                          Guía gratuita
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pegatina "GRATIS" */}
                <div
                  className="absolute -top-4 -right-4 w-16 h-16 rounded-full flex items-center justify-center text-center z-20"
                  style={{
                    background: 'linear-gradient(135deg, #F2C8D0, #E09AAA)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.35)',
                    fontSize: '10px',
                    fontWeight: 700,
                    color: '#5a2035',
                    lineHeight: 1.2,
                  }}
                >
                  100%<br/>GRATIS
                </div>
              </div>
            </div>

            {/* ── TEXTO + FORMULARIO ── */}
            <div className="order-1 md:order-2">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 mb-5"
                   style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '999px', padding: '5px 14px' }}>
                <Sparkles size={13} style={{ color: '#F2C8D0' }} />
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#F2C8D0', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Guía gratuita
                </span>
              </div>

              {/* Título */}
              <h2 className="font-serif mb-4"
                  style={{ fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 700, color: 'white', lineHeight: 1.25 }}>
                Lo que nadie te ha explicado<br/>
                <span style={{ color: '#F2C8D0', fontStyle: 'italic' }}>sobre tu fertilidad</span>
              </h2>

              <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.72)', lineHeight: 1.7, marginBottom: '20px' }}>
                Una guía práctica y honesta con 15 capítulos escritos desde +15 años de experiencia en reproducción asistida.
              </p>

              {/* Beneficios */}
              <ul className="mb-7 space-y-2.5">
                {BENEFITS.map((b, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle size={16} style={{ color: '#F2C8D0', flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.82)', lineHeight: 1.5 }}>{b}</span>
                  </li>
                ))}
              </ul>

              {/* Formulario / Estado éxito */}
              {!pdfUrl ? (
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      required
                      className="flex-1 px-4 py-3 rounded-full text-sm outline-none"
                      style={{
                        background: 'rgba(255,255,255,0.12)',
                        border: '1.5px solid rgba(255,255,255,0.25)',
                        color: 'white',
                        fontSize: '14px',
                      }}
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-200 active:scale-95 whitespace-nowrap"
                      style={{
                        background: loading ? 'rgba(242,200,208,0.5)' : 'linear-gradient(135deg, #F2C8D0, #E09AAA)',
                        color: '#3d1520',
                        fontSize: '14px',
                      }}
                    >
                      {loading ? 'Un momento…' : (
                        <>Quiero mi guía gratis <ArrowRight size={15} /></>
                      )}
                    </button>
                  </div>

                  {error && (
                    <p className="mt-2 text-sm" style={{ color: '#fca5a5' }}>{error}</p>
                  )}

                  <p className="mt-3" style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.4)' }}>
                    Sin spam. Solo información que te ayuda. Te puedes dar de baja cuando quieras.
                  </p>
                </form>
              ) : (
                /* Estado éxito */
                <div
                  className="rounded-2xl p-6"
                  style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle size={22} style={{ color: '#F2C8D0' }} />
                    <p className="font-semibold text-white">¡Ya está! Tu guía está lista.</p>
                  </div>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', marginBottom: '16px', lineHeight: 1.6 }}>
                    Haz clic en el botón para descargarla directamente. Espero que te ayude mucho.
                  </p>
                  <a
                    href={pdfUrl}
                    download
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-95"
                    style={{
                      background: 'linear-gradient(135deg, #F2C8D0, #E09AAA)',
                      color: '#3d1520',
                      fontSize: '14px',
                      textDecoration: 'none',
                    }}
                  >
                    <Download size={16} />
                    Descargar guía PDF
                  </a>
                  <p className="mt-3" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', fontStyle: 'italic' }}>
                    — Lidia · Fertilidad a Tu Lado
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
