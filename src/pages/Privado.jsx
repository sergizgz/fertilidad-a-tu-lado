import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { LogIn, LogOut, Mail, Calendar, MessageSquare, Tag } from 'lucide-react'

const SERVICE_LABELS = {
  preconcepcion: 'Preconcepción',
  fiv: 'FIV / IAC',
  consulta: 'Consulta puntual',
  otro: 'Orientación general',
}

// ── Login ──────────────────────────────────────────────────────────────────
function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email o contraseña incorrectos.')
    } else {
      onLogin()
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-rose-soft mb-4">
            <LogIn size={24} className="text-rose-accent" />
          </div>
          <h1 className="font-serif text-2xl text-[#2A2A2A]">Área privada</h1>
          <p className="text-sm text-[#9B9B9B] mt-1">Fertilidad a Tu Lado</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm border border-cream-darker/30 space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#2A2A2A] mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full border border-cream-darker rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-accent bg-cream/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2A2A2A] mb-1.5">Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-cream-darker rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-accent bg-cream/50 transition-colors"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-accent hover:bg-rose-dark text-white font-medium py-3 rounded-full transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? 'Entrando...' : 'Entrar'}
            {!loading && <LogIn size={16} />}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Dashboard ──────────────────────────────────────────────────────────────
function Dashboard({ session, onLogout }) {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/submissions', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        })
        if (!res.ok) throw new Error()
        const { submissions } = await res.json()
        setSubmissions(submissions)
      } catch {
        setError('No se pudieron cargar los datos.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [session])

  const filtered = submissions.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.message.toLowerCase().includes(search.toLowerCase())
  )

  const formatDate = (iso) => {
    const d = new Date(iso)
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-white border-b border-cream-darker/30 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-xl text-[#2A2A2A]">Consultas recibidas</h1>
          <p className="text-xs text-[#9B9B9B]">Fertilidad a Tu Lado · Área privada</p>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 text-sm text-[#6B6B6B] hover:text-rose-accent transition-colors"
        >
          <LogOut size={16} />
          Salir
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total consultas', value: submissions.length },
            { label: 'Este mes', value: submissions.filter(s => new Date(s.created_at).getMonth() === new Date().getMonth()).length },
            { label: 'Emails únicos', value: new Set(submissions.map(s => s.email)).size },
            { label: 'Sin servicio', value: submissions.filter(s => !s.service).length },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-2xl p-5 border border-cream-darker/30 text-center">
              <p className="font-serif text-3xl text-rose-accent">{value}</p>
              <p className="text-xs text-[#9B9B9B] mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Buscador */}
        <input
          type="text"
          placeholder="Buscar por nombre, email o mensaje..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full border border-cream-darker rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-accent bg-white mb-6 transition-colors"
        />

        {/* Tabla */}
        {loading ? (
          <div className="text-center py-20 text-[#9B9B9B]">Cargando...</div>
        ) : error ? (
          <div className="text-center py-20 text-red-400">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-[#9B9B9B]">No hay consultas todavía.</div>
        ) : (
          <div className="space-y-4">
            {filtered.map(s => (
              <div key={s.id} className="bg-white rounded-2xl p-6 border border-cream-darker/30 hover:border-rose-soft transition-colors">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
                  <div>
                    <p className="font-medium text-[#2A2A2A] text-lg">{s.name}</p>
                    <a href={`mailto:${s.email}`} className="flex items-center gap-1.5 text-sm text-rose-accent hover:underline mt-0.5">
                      <Mail size={13} />
                      {s.email}
                    </a>
                  </div>
                  <div className="flex flex-wrap gap-2 shrink-0">
                    {s.service && (
                      <span className="inline-flex items-center gap-1 bg-rose-soft/40 text-rose-dark text-xs font-medium px-3 py-1 rounded-full">
                        <Tag size={11} />
                        {SERVICE_LABELS[s.service] ?? s.service}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-[#9B9B9B] text-xs">
                      <Calendar size={11} />
                      {formatDate(s.created_at)}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm text-[#4A4A4A] leading-relaxed bg-cream/60 rounded-xl px-4 py-3">
                  <MessageSquare size={14} className="text-rose-accent shrink-0 mt-0.5" />
                  <p>{s.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Página principal ───────────────────────────────────────────────────────
export default function Privado() {
  const [session, setSession] = useState(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setChecking(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setSession(null)
  }

  if (checking) {
    return <div className="min-h-screen bg-cream flex items-center justify-center text-[#9B9B9B]">...</div>
  }

  if (!session) {
    return <LoginForm onLogin={() => supabase.auth.getSession().then(({ data: { session } }) => setSession(session))} />
  }

  return <Dashboard session={session} onLogout={handleLogout} />
}
