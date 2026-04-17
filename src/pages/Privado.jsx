import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import {
  LogIn, LogOut, LayoutDashboard, Mail, ChevronDown, ChevronUp,
  TrendingUp, Users, Calendar, Tag, MessageSquare, Search,
  Download, ExternalLink, Menu, X
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
const SERVICE_LABELS = {
  preconcepcion: 'Preconcepción',
  fiv: 'FIV / IAC',
  consulta: 'Consulta puntual',
  otro: 'Orientación general',
}

const SERVICE_COLORS = {
  preconcepcion: 'bg-purple-100 text-purple-700',
  fiv: 'bg-rose-100 text-rose-700',
  consulta: 'bg-amber-100 text-amber-700',
  otro: 'bg-slate-100 text-slate-600',
}

function fmt(iso) {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function fmtShort(iso) {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

function exportCSV(data) {
  const headers = ['Fecha', 'Nombre', 'Email', 'Servicio', 'Mensaje']
  const rows = data.map(s => [
    fmt(s.created_at), s.name, s.email,
    SERVICE_LABELS[s.service] ?? s.service ?? '—',
    `"${s.message.replace(/"/g, '""')}"`,
  ])
  const csv = [headers, ...rows].map(r => r.join(';')).join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url
  a.download = `consultas_${new Date().toISOString().slice(0, 10)}.csv`
  a.click(); URL.revokeObjectURL(url)
}

// ─────────────────────────────────────────────────────────────────────────────
// Login
// ─────────────────────────────────────────────────────────────────────────────
function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError('Email o contraseña incorrectos.')
    else onLogin()
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
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full border border-cream-darker rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-accent bg-cream/50 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2A2A2A] mb-1.5">Contraseña</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-cream-darker rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-accent bg-cream/50 transition-colors" />
          </div>
          {error && <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-rose-accent hover:bg-rose-dark text-white font-medium py-3 rounded-full transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2">
            {loading ? 'Entrando...' : <><LogIn size={16} /> Entrar</>}
          </button>
        </form>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Sección: Estadísticas
// ─────────────────────────────────────────────────────────────────────────────
function StatsSection({ submissions }) {
  const now = new Date()
  const thisMonth = submissions.filter(s => {
    const d = new Date(s.created_at)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })
  const thisWeek = submissions.filter(s => {
    const d = new Date(s.created_at)
    const diff = (now - d) / (1000 * 60 * 60 * 24)
    return diff <= 7
  })
  const uniqueEmails = new Set(submissions.map(s => s.email)).size

  const byService = Object.entries(
    submissions.reduce((acc, s) => {
      const key = SERVICE_LABELS[s.service] ?? 'Sin especificar'
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})
  ).sort((a, b) => b[1] - a[1])

  const topService = byService[0]

  const stats = [
    { label: 'Total consultas', value: submissions.length, icon: Mail, color: 'text-rose-accent', bg: 'bg-rose-soft/30' },
    { label: 'Este mes', value: thisMonth.length, icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Esta semana', value: thisWeek.length, icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Personas únicas', value: uniqueEmails, icon: Users, color: 'text-teal-500', bg: 'bg-teal-50' },
  ]

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-xl text-[#2A2A2A]">Resumen</h2>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-cream-darker/20">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${bg} mb-3`}>
              <Icon size={18} className={color} />
            </div>
            <p className={`font-serif text-3xl font-medium ${color}`}>{value}</p>
            <p className="text-xs text-[#9B9B9B] mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Distribución por servicio */}
      <div className="bg-white rounded-2xl p-6 border border-cream-darker/20">
        <h3 className="font-medium text-[#2A2A2A] mb-4 text-sm flex items-center gap-2">
          <Tag size={15} className="text-rose-accent" /> Distribución por servicio
        </h3>
        {submissions.length === 0 ? (
          <p className="text-sm text-[#9B9B9B]">Sin datos todavía.</p>
        ) : (
          <div className="space-y-3">
            {byService.map(([label, count]) => (
              <div key={label} className="flex items-center gap-3">
                <span className="text-sm text-[#4A4A4A] w-40 shrink-0">{label}</span>
                <div className="flex-1 bg-cream-dark rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-rose-accent rounded-full transition-all duration-500"
                    style={{ width: `${(count / submissions.length) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-[#2A2A2A] w-8 text-right">{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Últimas 3 consultas */}
      {submissions.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-cream-darker/20">
          <h3 className="font-medium text-[#2A2A2A] mb-4 text-sm flex items-center gap-2">
            <MessageSquare size={15} className="text-rose-accent" /> Últimas consultas
          </h3>
          <div className="space-y-3">
            {submissions.slice(0, 3).map(s => (
              <div key={s.id} className="flex items-center justify-between gap-4 py-2 border-b border-cream-dark last:border-0">
                <div className="min-w-0">
                  <p className="font-medium text-sm text-[#2A2A2A] truncate">{s.name}</p>
                  <p className="text-xs text-[#9B9B9B] truncate">{s.email}</p>
                </div>
                <span className="text-xs text-[#9B9B9B] shrink-0">{fmtShort(s.created_at)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Sección: Solicitudes (tabla)
// ─────────────────────────────────────────────────────────────────────────────
function SubmissionsSection({ submissions }) {
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState('created_at')
  const [sortDir, setSortDir] = useState('desc')
  const [expanded, setExpanded] = useState(null)
  const [serviceFilter, setServiceFilter] = useState('')

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('asc') }
  }

  const filtered = submissions
    .filter(s =>
      (!serviceFilter || s.service === serviceFilter) &&
      (s.name.toLowerCase().includes(search.toLowerCase()) ||
       s.email.toLowerCase().includes(search.toLowerCase()) ||
       s.message.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      const va = a[sortField] ?? ''; const vb = b[sortField] ?? ''
      return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
    })

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronDown size={13} className="text-[#C0C0C0]" />
    return sortDir === 'asc'
      ? <ChevronUp size={13} className="text-rose-accent" />
      : <ChevronDown size={13} className="text-rose-accent" />
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="font-serif text-xl text-[#2A2A2A]">Solicitudes de información
          <span className="ml-2 text-sm font-sans font-normal text-[#9B9B9B]">({filtered.length})</span>
        </h2>
        <button onClick={() => exportCSV(filtered)}
          className="inline-flex items-center gap-2 text-sm text-rose-accent hover:text-rose-dark border border-rose-soft rounded-full px-4 py-2 transition-colors">
          <Download size={14} /> Exportar CSV
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B9B9B]" />
          <input type="text" placeholder="Buscar por nombre, email o mensaje..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full border border-cream-darker rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-rose-accent bg-white transition-colors" />
        </div>
        <select value={serviceFilter} onChange={e => setServiceFilter(e.target.value)}
          className="border border-cream-darker rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-accent bg-white text-[#4A4A4A]">
          <option value="">Todos los servicios</option>
          {Object.entries(SERVICE_LABELS).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      </div>

      {/* Tabla */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-cream-darker/20 py-16 text-center text-[#9B9B9B] text-sm">
          No hay consultas que coincidan.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-cream-darker/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cream-dark bg-cream/50">
                  {[
                    { label: 'Fecha', field: 'created_at' },
                    { label: 'Nombre', field: 'name' },
                    { label: 'Email', field: 'email' },
                    { label: 'Servicio', field: 'service' },
                    { label: 'Mensaje', field: null },
                  ].map(({ label, field }) => (
                    <th key={label}
                      onClick={() => field && toggleSort(field)}
                      className={`text-left px-4 py-3 font-medium text-[#6B6B6B] whitespace-nowrap ${field ? 'cursor-pointer hover:text-rose-accent select-none' : ''}`}>
                      <span className="inline-flex items-center gap-1">
                        {label} {field && <SortIcon field={field} />}
                      </span>
                    </th>
                  ))}
                  <th className="px-4 py-3 font-medium text-[#6B6B6B]">Acción</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <>
                    <tr key={s.id}
                      className="border-b border-cream-dark/50 hover:bg-cream/40 transition-colors cursor-pointer"
                      onClick={() => setExpanded(expanded === s.id ? null : s.id)}>
                      <td className="px-4 py-3 text-[#9B9B9B] whitespace-nowrap">{fmtShort(s.created_at)}</td>
                      <td className="px-4 py-3 font-medium text-[#2A2A2A] whitespace-nowrap">{s.name}</td>
                      <td className="px-4 py-3 text-[#4A4A4A] whitespace-nowrap">{s.email}</td>
                      <td className="px-4 py-3">
                        {s.service ? (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${SERVICE_COLORS[s.service] ?? 'bg-slate-100 text-slate-600'}`}>
                            {SERVICE_LABELS[s.service] ?? s.service}
                          </span>
                        ) : <span className="text-[#C0C0C0]">—</span>}
                      </td>
                      <td className="px-4 py-3 text-[#6B6B6B] max-w-xs">
                        <span className={expanded === s.id ? '' : 'line-clamp-1'}>{s.message}</span>
                      </td>
                      <td className="px-4 py-3">
                        <a href={`mailto:${s.email}?subject=Re: Tu consulta en Fertilidad a Tu Lado`}
                          onClick={e => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-xs text-rose-accent hover:text-rose-dark font-medium">
                          <ExternalLink size={12} /> Responder
                        </a>
                      </td>
                    </tr>
                    {expanded === s.id && (
                      <tr key={`${s.id}-exp`} className="bg-cream/30">
                        <td colSpan={6} className="px-4 py-3">
                          <div className="flex items-start gap-2 text-sm text-[#4A4A4A] leading-relaxed bg-white rounded-xl px-4 py-3 border border-cream-darker/30">
                            <MessageSquare size={14} className="text-rose-accent shrink-0 mt-0.5" />
                            <p>{s.message}</p>
                          </div>
                          <p className="text-xs text-[#9B9B9B] mt-1.5 pl-1">{fmt(s.created_at)}</p>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard principal
// ─────────────────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'stats', label: 'Resumen', icon: LayoutDashboard },
  { id: 'submissions', label: 'Solicitudes', icon: Mail },
  // Futuras secciones: Descargas, Planes, etc.
]

function Dashboard({ session, onLogout }) {
  const [activeSection, setActiveSection] = useState('stats')
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    fetch('/api/submissions', {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then(r => r.json())
      .then(({ submissions }) => setSubmissions(submissions ?? []))
      .finally(() => setLoading(false))
  }, [session])

  const NavItem = ({ item }) => (
    <button
      onClick={() => { setActiveSection(item.id); setSidebarOpen(false) }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
        activeSection === item.id
          ? 'bg-rose-soft/40 text-rose-dark'
          : 'text-[#6B6B6B] hover:bg-cream-dark/50'
      }`}>
      <item.icon size={17} />
      {item.label}
    </button>
  )

  return (
    <div className="min-h-screen bg-[#F5F0F1] flex">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-56 shrink-0 flex-col bg-white border-r border-cream-darker/30 p-4">
        <div className="mb-6 px-2 pt-2">
          <p className="font-serif text-base text-[#2A2A2A]">Fertilidad <span className="text-rose-accent">a Tu Lado</span></p>
          <p className="text-xs text-[#9B9B9B] mt-0.5">Panel de gestión</p>
        </div>
        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map(item => <NavItem key={item.id} item={item} />)}
        </nav>
        <div className="border-t border-cream-dark pt-4">
          <button onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-[#9B9B9B] hover:text-rose-accent hover:bg-rose-soft/20 transition-colors">
            <LogOut size={16} /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Sidebar mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-56 bg-white p-4 flex flex-col shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <p className="font-serif text-base text-[#2A2A2A]">Panel</p>
              <button onClick={() => setSidebarOpen(false)}><X size={20} className="text-[#9B9B9B]" /></button>
            </div>
            <nav className="flex-1 space-y-1">
              {NAV_ITEMS.map(item => <NavItem key={item.id} item={item} />)}
            </nav>
            <button onClick={onLogout}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#9B9B9B]">
              <LogOut size={16} /> Cerrar sesión
            </button>
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-white border-b border-cream-darker/30 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} className="text-[#6B6B6B]" />
            </button>
            <h1 className="font-medium text-[#2A2A2A] text-sm">
              {NAV_ITEMS.find(i => i.id === activeSection)?.label}
            </h1>
          </div>
          <span className="text-xs text-[#9B9B9B]">{session.user.email}</span>
        </header>

        {/* Content */}
        <main className="flex-1 p-5 md:p-8 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-40 text-[#9B9B9B] text-sm">Cargando datos...</div>
          ) : (
            <>
              {activeSection === 'stats' && <StatsSection submissions={submissions} />}
              {activeSection === 'submissions' && <SubmissionsSection submissions={submissions} />}
            </>
          )}
        </main>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Página raíz
// ─────────────────────────────────────────────────────────────────────────────
export default function Privado() {
  const [session, setSession] = useState(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session); setChecking(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setSession(session))
    return () => subscription.unsubscribe()
  }, [])

  if (checking) return <div className="min-h-screen bg-cream flex items-center justify-center text-[#9B9B9B] text-sm">...</div>
  if (!session) return <LoginForm onLogin={() => supabase.auth.getSession().then(({ data: { session } }) => setSession(session))} />
  return <Dashboard session={session} onLogout={() => supabase.auth.signOut()} />
}
