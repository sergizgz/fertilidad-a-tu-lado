import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

const PROCESO_OPTIONS = [
  'Estoy empezando a informarme',
  'Estoy en proceso de búsqueda de embarazo natural',
  'Estoy en tratamiento de reproducción asistida',
  'Ya soy mamá/papá pero quiero trabajar mi relación con la fertilidad',
]

const COMO_SUPO_OPTIONS = ['Instagram', 'Recomendación', 'Web', 'Otro']

const inputClass =
  'w-full border border-cream-darker rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-rose-accent transition-colors'

const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

export default function Formulario() {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    pais: '',
    proceso: '',
    objetivo: '',
    como_supo: '',
    privacidad: false,
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!form.privacidad) {
      setError('Debes aceptar la política de privacidad para continuar.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/ig-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          email: form.email,
          telefono: form.telefono,
          pais: form.pais,
          proceso: form.proceso || undefined,
          objetivo: form.objetivo,
          como_supo: form.como_supo || undefined,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al enviar la solicitud')

      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Ha ocurrido un error. Por favor, inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <>
        <Helmet>
          <title>Solicitud enviada — Fertilidad a Tu Lado</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-16">
          <div className="bg-white rounded-2xl shadow-sm border border-cream-darker max-w-[560px] w-full p-10 text-center">
            <div className="w-16 h-16 bg-rose-soft rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-rose-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="font-serif text-2xl text-rose-dark font-semibold mb-3">
              ¡Solicitud enviada!
            </h1>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Gracias por dar este paso. He recibido tu solicitud y me pondré en contacto contigo en
              menos de <strong>24 horas en días laborables</strong>.
            </p>
            <div className="bg-cream-dark border-l-4 border-rose-accent rounded-lg px-5 py-4 text-left mb-6">
              <p className="text-rose-dark text-sm italic leading-relaxed">
                "No estás sola en este camino. Y mereces entender lo que te está pasando."
              </p>
              <p className="text-rose-accent text-xs font-semibold mt-2">— Lidia</p>
            </div>
            <p className="text-xs text-gray-400">
              También te hemos enviado un correo de confirmación. Si no lo ves, revisa tu carpeta de spam.
            </p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>Solicitud de acompañamiento — Fertilidad a Tu Lado</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-cream px-4 py-12">
        <div className="max-w-[560px] mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <p className="text-2xl mb-2">🌷</p>
            <h1 className="font-serif text-xl font-semibold text-rose-dark">
              Fertilidad a Tu Lado
            </h1>
            <p className="text-gray-500 text-xs mt-1">Lidia · Enfermera especialista en reproducción asistida</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-cream-darker overflow-hidden">
            <div className="bg-rose-accent px-6 py-5">
              <h2 className="font-serif text-white text-lg font-semibold">
                Solicitud de acompañamiento
              </h2>
              <p className="text-white/80 text-xs mt-1 leading-relaxed">
                Cuéntame un poco sobre ti y tu situación. Te responderé en menos de 24 horas.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-7 space-y-5">
              {/* Nombre */}
              <div>
                <label htmlFor="nombre" className={labelClass}>
                  Nombre completo <span className="text-rose-accent">*</span>
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  required
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                  className={inputClass}
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className={labelClass}>
                  Email <span className="text-rose-accent">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  className={inputClass}
                />
              </div>

              {/* Teléfono */}
              <div>
                <label htmlFor="telefono" className={labelClass}>
                  Teléfono (con prefijo internacional) <span className="text-rose-accent">*</span>
                </label>
                <input
                  id="telefono"
                  name="telefono"
                  type="text"
                  required
                  value={form.telefono}
                  onChange={handleChange}
                  placeholder="+34 600 000 000"
                  className={inputClass}
                />
              </div>

              {/* País */}
              <div>
                <label htmlFor="pais" className={labelClass}>
                  País de residencia <span className="text-rose-accent">*</span>
                </label>
                <input
                  id="pais"
                  name="pais"
                  type="text"
                  required
                  value={form.pais}
                  onChange={handleChange}
                  placeholder="España"
                  className={inputClass}
                />
              </div>

              {/* Proceso */}
              <div>
                <p className={labelClass}>¿En qué punto del proceso te encuentras?</p>
                <div className="space-y-2.5">
                  {PROCESO_OPTIONS.map((option) => (
                    <label key={option} className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="proceso"
                        value={option}
                        checked={form.proceso === option}
                        onChange={handleChange}
                        className="mt-0.5 accent-rose-accent shrink-0"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-gray-800 leading-snug">
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Objetivo */}
              <div>
                <label htmlFor="objetivo" className={labelClass}>
                  ¿Qué te gustaría conseguir con este acompañamiento? <span className="text-rose-accent">*</span>
                </label>
                <textarea
                  id="objetivo"
                  name="objetivo"
                  required
                  rows={4}
                  value={form.objetivo}
                  onChange={handleChange}
                  placeholder="Cuéntame con tus palabras qué necesitas..."
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Cómo supo */}
              <div>
                <p className={labelClass}>¿Cómo supiste de este acompañamiento?</p>
                <div className="flex flex-wrap gap-x-5 gap-y-2.5">
                  {COMO_SUPO_OPTIONS.map((option) => (
                    <label key={option} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="como_supo"
                        value={option}
                        checked={form.como_supo === option}
                        onChange={handleChange}
                        className="accent-rose-accent"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-gray-800">
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Privacidad */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="privacidad"
                    checked={form.privacidad}
                    onChange={handleChange}
                    className="mt-0.5 accent-rose-accent shrink-0"
                    required
                  />
                  <span className="text-sm text-gray-600 leading-snug">
                    He leído y acepto la{' '}
                    <Link
                      to="/privacidad"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-rose-accent underline underline-offset-2 hover:text-rose-dark"
                    >
                      política de privacidad
                    </Link>{' '}
                    <span className="text-rose-accent">*</span>
                  </span>
                </label>
              </div>

              {/* Error message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-rose-accent hover:bg-rose-dark text-white font-semibold py-3.5 rounded-full text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Enviando…
                  </span>
                ) : (
                  'Enviar solicitud'
                )}
              </button>

              <p className="text-xs text-gray-400 text-center pt-1">
                Los campos marcados con <span className="text-rose-accent">*</span> son obligatorios.
              </p>
            </form>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            © {new Date().getFullYear()} Fertilidad a Tu Lado · Lidia
          </p>
        </div>
      </div>
    </>
  )
}
