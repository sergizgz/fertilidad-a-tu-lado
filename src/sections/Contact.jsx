import { useState, useEffect } from 'react'
import { Send, AtSign, Mail, CheckCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '', service: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [services, setServices] = useState([])

  useEffect(() => {
    supabase
      .from('services')
      .select('id, title')
      .eq('active', true)
      .order('sort_order')
      .then(({ data }) => { if (data) setServices(data) })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) throw new Error('Error en el servidor')
      setSent(true)
    } catch {
      setError('Ha ocurrido un error al enviar el mensaje. Inténtalo de nuevo o escríbeme directamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contacto" className="py-24 bg-cream-dark">
      <div className="max-w-5xl mx-auto px-5">
        <div className="text-center mb-14">
          <p className="text-rose-accent font-medium text-sm uppercase tracking-wider mb-3">Contacto</p>
          <h2 className="section-title mb-4">¿Hablamos?</h2>
          <p className="section-subtitle max-w-lg mx-auto">
            Cuéntame dónde estás. Sin prisas, sin compromisos. Solo queremos entender si podemos ayudarte.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Form */}
          <div className="md:col-span-3 bg-white rounded-3xl p-8 shadow-sm border border-cream-darker/30">
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-10 gap-4">
                <CheckCircle size={48} className="text-rose-accent" />
                <h3 className="font-serif text-2xl text-[#2A2A2A]">¡Mensaje recibido!</h3>
                <p className="text-[#6B6B6B]">Te respondo en menos de 24 horas. Mientras tanto, sígueme en Instagram para más contenido.</p>
                <a href="https://www.instagram.com/fertilidad_atulado/" target="_blank" rel="noopener noreferrer" className="btn-primary mt-2">
                  <AtSign size={16} />
                  @fertilidad_atulado
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[#2A2A2A] mb-1.5">Nombre</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="Tu nombre"
                      className="w-full border border-cream-darker rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-accent bg-cream/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2A2A2A] mb-1.5">Email</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="tu@email.com"
                      className="w-full border border-cream-darker rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-accent bg-cream/50 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2A2A2A] mb-1.5">¿Qué necesitas?</label>
                  <select
                    value={form.service}
                    onChange={e => setForm({ ...form, service: e.target.value })}
                    className="w-full border border-cream-darker rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-accent bg-cream/50 text-[#6B6B6B] transition-colors"
                  >
                    <option value="">Selecciona una opción</option>
                    {services.map(s => (
                      <option key={s.id} value={s.title}>{s.title}</option>
                    ))}
                    <option value="No sé, necesito orientación">No sé, necesito orientación</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2A2A2A] mb-1.5">Cuéntame un poco</label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="¿En qué punto estás? ¿Qué dudas tienes? Cuéntame lo que quieras..."
                    className="w-full border border-cream-darker rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-accent bg-cream/50 resize-none transition-colors"
                  />
                </div>

                <p className="text-xs text-[#9B9B9B]">
                  Al enviar este formulario aceptas la <a href="/privacidad" className="underline hover:text-rose-accent">política de privacidad</a>.
                </p>

                {error && (
                  <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Enviando...' : 'Enviar mensaje'}
                  {!loading && <Send size={16} />}
                </button>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div className="md:col-span-2 flex flex-col gap-6 justify-center">
            <div className="bg-white rounded-2xl p-6 border border-cream-darker/30">
              <h4 className="font-medium text-[#2A2A2A] mb-2 text-sm">Tiempo de respuesta</h4>
              <p className="text-[#6B6B6B] text-sm leading-relaxed">Respondo en menos de 24h en días laborables.</p>
            </div>

            <a
              href="https://www.instagram.com/fertilidad_atulado/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl p-6 border border-cream-darker/30 flex items-center gap-4 hover:border-rose-accent transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-soft flex items-center justify-center">
                <AtSign size={20} className="text-rose-accent" />
              </div>
              <div>
                <p className="font-medium text-[#2A2A2A] text-sm group-hover:text-rose-accent transition-colors">Instagram</p>
                <p className="text-[#9B9B9B] text-xs">@fertilidad_atulado</p>
              </div>
            </a>

            <a
              href="mailto:hola@fertilidadatulado.com"
              className="bg-white rounded-2xl p-6 border border-cream-darker/30 flex items-center gap-4 hover:border-rose-accent transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-soft flex items-center justify-center">
                <Mail size={20} className="text-rose-accent" />
              </div>
              <div>
                <p className="font-medium text-[#2A2A2A] text-sm group-hover:text-rose-accent transition-colors">Email</p>
                <p className="text-[#9B9B9B] text-xs">hola@fertilidadatulado.com</p>
              </div>
            </a>

            <div className="bg-rose-soft/40 rounded-2xl p-6">
              <p className="text-rose-dark text-sm leading-relaxed italic font-serif">
                "No estás sola en este camino. Y mereces entender lo que te está pasando."
              </p>
              <p className="text-rose-accent text-xs mt-2 font-medium">— Lidia</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
