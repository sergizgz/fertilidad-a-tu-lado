import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import * as XLSX from 'xlsx'
import {
  LogIn, LogOut, LayoutDashboard, Mail, ChevronDown, ChevronUp,
  TrendingUp, Users, Calendar, Tag, MessageSquare, Search,
  Download, ExternalLink, Menu, X, StickyNote, CheckCircle2,
  Clock, PhoneCall, XCircle, BookOpen, ImageIcon, Upload, CheckCircle, AlertCircle, Loader2,
  Leaf, Heart, Stethoscope, Baby, Star, Shield, Sparkles, Moon, Sun,
  Layers, Plus, Pencil, Trash2, GripVertical, Eye, EyeOff, ArrowUp, ArrowDown,
} from 'lucide-react'
import PostList from '../components/blog/PostList'
import PostEditor from '../components/blog/PostEditor'
import { ICON_MAP } from '../sections/Services'

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
// Etiquetas legacy para envíos anteriores a la gestión dinámica de servicios
const LEGACY_SERVICE_LABELS = {
  preconcepcion: 'Preconcepción',
  fiv: 'FIV / IA',
  consulta: 'Consulta puntual',
  otro: 'Orientación general',
}

// Si el valor es un slug antiguo lo traduce; si ya es un título legible lo devuelve tal cual
function resolveServiceLabel(service) {
  if (!service) return '—'
  return LEGACY_SERVICE_LABELS[service] ?? service
}

// Color genérico para servicios dinámicos que no están en el mapa legacy
const LEGACY_SERVICE_COLORS = {
  preconcepcion: 'bg-purple-100 text-purple-700',
  fiv: 'bg-rose-100 text-rose-700',
  consulta: 'bg-amber-100 text-amber-700',
  otro: 'bg-slate-100 text-slate-600',
}

function serviceColor(service) {
  return LEGACY_SERVICE_COLORS[service] ?? 'bg-rose-50 text-rose-700'
}

const STATUS_CONFIG = {
  pendiente:    { label: 'Pendiente',    color: 'bg-amber-100 text-amber-700',  icon: Clock },
  en_contacto:  { label: 'En contacto', color: 'bg-blue-100 text-blue-700',    icon: PhoneCall },
  atendido:     { label: 'Atendida',    color: 'bg-green-100 text-green-700',  icon: CheckCircle2 },
  descartado:   { label: 'Descartada',  color: 'bg-slate-100 text-slate-500',  icon: XCircle },
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

function exportXLSX(data) {
  const rows = data.map(s => ({
    'Fecha':    fmt(s.created_at),
    'Nombre':   s.name,
    'Email':    s.email,
    'Servicio': resolveServiceLabel(s.service),
    'Estado':   STATUS_CONFIG[s.status]?.label ?? s.status ?? 'Pendiente',

    'Mensaje':  s.message,
    'Notas':    s.notes ?? '',
  }))
  const ws = XLSX.utils.json_to_sheet(rows)
  // Anchos de columna
  ws['!cols'] = [
    { wch: 20 }, { wch: 22 }, { wch: 30 },
    { wch: 20 }, { wch: 14 }, { wch: 50 }, { wch: 40 },
  ]
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Solicitudes')
  XLSX.writeFile(wb, `consultas_${new Date().toISOString().slice(0, 10)}.xlsx`)
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
function StatsSection({ submissions, subscriberCount }) {

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
      const key = resolveServiceLabel(s.service) === '—' ? 'Sin especificar' : resolveServiceLabel(s.service)
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
    { label: 'Suscriptores guía', value: subscriberCount ?? '…', icon: Download, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ]

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-xl text-[#2A2A2A]">Resumen</h2>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
function SubmissionsSection({ submissions, onUpdate, token }) {
  const [search, setSearch]           = useState('')
  const [sortField, setSortField]     = useState('created_at')
  const [sortDir, setSortDir]         = useState('desc')
  const [expanded, setExpanded]       = useState(null)
  const [serviceFilter, setServiceFilter] = useState('')
  const [statusFilter, setStatusFilter]   = useState('')
  const [savingId, setSavingId]       = useState(null)
  const [notesDraft, setNotesDraft]   = useState({}) // { [id]: string }

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('asc') }
  }

  // Opciones únicas de servicio presentes en los envíos reales
  const serviceOptions = [...new Set(submissions.map(s => s.service).filter(Boolean))]
    .map(val => ({ val, label: resolveServiceLabel(val) }))
    .sort((a, b) => a.label.localeCompare(b.label))

  const filtered = submissions
    .filter(s =>
      (!serviceFilter || s.service === serviceFilter) &&
      (!statusFilter  || s.status  === statusFilter)  &&
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

  const handleStatusChange = async (id, status) => {
    setSavingId(id)
    const res = await fetch('/api/update-submission', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, status }),
    })
    const { submission } = await res.json()
    if (submission) onUpdate(submission)
    setSavingId(null)
  }

  const handleNotesSave = async (id) => {
    setSavingId(id)
    const res = await fetch('/api/update-submission', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, notes: notesDraft[id] ?? '' }),
    })
    const { submission } = await res.json()
    if (submission) onUpdate(submission)
    setSavingId(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="font-serif text-xl text-[#2A2A2A]">Solicitudes de información
          <span className="ml-2 text-sm font-sans font-normal text-[#9B9B9B]">({filtered.length})</span>
        </h2>
        <button onClick={() => exportXLSX(filtered)}
          className="inline-flex items-center gap-2 text-sm text-rose-accent hover:text-rose-dark border border-rose-soft rounded-full px-4 py-2 transition-colors">
          <Download size={14} /> Exportar Excel
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
          {serviceOptions.map(({ val, label }) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="border border-cream-darker rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-accent bg-white text-[#4A4A4A]">
          <option value="">Todos los estados</option>
          {Object.entries(STATUS_CONFIG).map(([val, { label }]) => (
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
                    { label: 'Fecha',    field: 'created_at' },
                    { label: 'Nombre',   field: 'name' },
                    { label: 'Email',    field: 'email' },
                    { label: 'Servicio', field: 'service' },
                    { label: 'Estado',   field: 'status' },
                    { label: 'Mensaje',  field: null },
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
                {filtered.map(s => {
                  const statusCfg = STATUS_CONFIG[s.status] ?? STATUS_CONFIG.pendiente
                  const StatusIcon = statusCfg.icon
                  const isExpanded = expanded === s.id
                  const notesVal = notesDraft[s.id] !== undefined ? notesDraft[s.id] : (s.notes ?? '')

                  return (
                    <>
                      <tr key={s.id}
                        className="border-b border-cream-dark/50 hover:bg-cream/30 transition-colors cursor-pointer"
                        onClick={() => setExpanded(isExpanded ? null : s.id)}>
                        <td className="px-4 py-3 text-[#9B9B9B] whitespace-nowrap">{fmtShort(s.created_at)}</td>
                        <td className="px-4 py-3 font-medium text-[#2A2A2A] whitespace-nowrap">{s.name}</td>
                        <td className="px-4 py-3 text-[#4A4A4A] whitespace-nowrap">{s.email}</td>
                        <td className="px-4 py-3">
                          {s.service
                            ? <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${serviceColor(s.service)}`}>
                                {resolveServiceLabel(s.service)}
                              </span>
                            : <span className="text-[#C0C0C0]">—</span>}
                        </td>
                        <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                          <select
                            value={s.status ?? 'pendiente'}
                            disabled={savingId === s.id}
                            onChange={e => handleStatusChange(s.id, e.target.value)}
                            className={`text-xs font-medium px-2.5 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-accent/30 disabled:opacity-50 ${statusCfg.color}`}>
                            {Object.entries(STATUS_CONFIG).map(([val, { label }]) => (
                              <option key={val} value={val}>{label}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-[#6B6B6B] max-w-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="line-clamp-1">{s.message}</span>
                            {s.notes && <StickyNote size={12} className="text-amber-400 shrink-0" title="Tiene notas" />}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <a href={`mailto:${s.email}?subject=Re: Tu consulta en Fertilidad a Tu Lado`}
                            onClick={e => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-xs text-rose-accent hover:text-rose-dark font-medium whitespace-nowrap">
                            <ExternalLink size={12} /> Responder
                          </a>
                        </td>
                      </tr>

                      {/* Fila expandida */}
                      {isExpanded && (
                        <tr key={`${s.id}-exp`} className="bg-cream/20">
                          <td colSpan={7} className="px-5 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Mensaje */}
                              <div>
                                <p className="text-xs font-medium text-[#6B6B6B] mb-2 flex items-center gap-1.5">
                                  <MessageSquare size={12} className="text-rose-accent" /> Mensaje
                                </p>
                                <div className="bg-white rounded-xl px-4 py-3 border border-cream-darker/30 text-sm text-[#4A4A4A] leading-relaxed">
                                  {s.message}
                                </div>
                                <p className="text-xs text-[#9B9B9B] mt-1.5">{fmt(s.created_at)}</p>
                              </div>

                              {/* Notas */}
                              <div>
                                <p className="text-xs font-medium text-[#6B6B6B] mb-2 flex items-center gap-1.5">
                                  <StickyNote size={12} className="text-amber-500" /> Notas internas
                                </p>
                                <textarea
                                  rows={4}
                                  placeholder="Añade tus notas sobre esta consulta..."
                                  value={notesVal}
                                  onChange={e => setNotesDraft(d => ({ ...d, [s.id]: e.target.value }))}
                                  className="w-full border border-cream-darker rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-accent bg-white resize-none transition-colors"
                                />
                                <div className="flex justify-end mt-2">
                                  <button
                                    disabled={savingId === s.id}
                                    onClick={() => handleNotesSave(s.id)}
                                    className="inline-flex items-center gap-1.5 bg-rose-accent hover:bg-rose-dark text-white text-xs font-medium px-4 py-1.5 rounded-full transition-colors disabled:opacity-50">
                                    {savingId === s.id ? 'Guardando...' : 'Guardar nota'}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  )
                })}
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
// ─────────────────────────────────────────────────────────────────────────────
// Sección: Blog
// ─────────────────────────────────────────────────────────────────────────────
function BlogSection({ token }) {
  const [view, setView] = useState('list')   // 'list' | 'create' | 'edit'
  const [editingPost, setEditingPost] = useState(null)
  const [listKey, setListKey] = useState(0)  // forzar re-fetch al volver

  const handleNew = () => { setEditingPost(null); setView('create') }
  const handleEdit = (post) => { setEditingPost(post); setView('edit') }
  const handleSave = () => { setView('list'); setListKey(k => k + 1) }
  const handleCancel = () => { setView('list') }

  if (view === 'create' || view === 'edit') {
    return (
      <PostEditor
        post={editingPost}
        token={token}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    )
  }

  return <PostList key={listKey} token={token} onNew={handleNew} onEdit={handleEdit} />
}

// ─────────────────────────────────────────────────────────────────────────────
// Sección: Imágenes
// ─────────────────────────────────────────────────────────────────────────────
function ImageUploadCard({ label, settingKey, currentUrl, onUploaded }) {
  const [file, setFile]       = useState(null)
  const [preview, setPreview] = useState(null)
  const [status, setStatus]   = useState(null) // null | 'uploading' | 'ok' | 'error'
  const [errorMsg, setErrorMsg] = useState('')

  const handleFile = (e) => {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setStatus(null)
  }

  // Comprime la imagen usando Canvas antes de subir
  const compressImage = (file, maxW = 1920, quality = 0.85) =>
    new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width)
        const canvas = document.createElement('canvas')
        canvas.width  = Math.round(img.width  * scale)
        canvas.height = Math.round(img.height * scale)
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
        canvas.toBlob(resolve, 'image/jpeg', quality)
      }
      img.src = URL.createObjectURL(file)
    })

  const handleUpload = async () => {
    if (!file) return
    setStatus('uploading')
    setErrorMsg('')
    try {
      // Comprimir antes de subir (máx 1920px, calidad 85%)
      const compressed = await compressImage(file)
      const path = settingKey === 'hero_image_url' ? 'hero.jpg' : 'lidia.jpg'

      // 1. Subir al bucket
      const { error: uploadError } = await supabase.storage
        .from('site-images')
        .upload(path, compressed, { upsert: true, contentType: 'image/jpeg' })
      if (uploadError) throw uploadError

      // 2. Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('site-images')
        .getPublicUrl(path)
      const urlWithBuster = `${publicUrl}?v=${Date.now()}`

      // 3. Guardar en site_settings
      const { error: settingError } = await supabase
        .from('site_settings')
        .upsert({ key: settingKey, value: urlWithBuster, updated_at: new Date().toISOString() })
      if (settingError) throw settingError

      setStatus('ok')
      onUploaded(urlWithBuster)
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.message ?? 'Error al subir la imagen')
    }
  }

  const displayUrl = preview || currentUrl

  return (
    <div className="bg-white rounded-2xl border border-cream-darker/30 overflow-hidden">
      {/* Preview */}
      <div className="relative bg-cream-dark" style={{ aspectRatio: settingKey === 'hero_image_url' ? '16/7' : '1/1', maxHeight: 220, overflow: 'hidden' }}>
        {displayUrl ? (
          <img
            src={displayUrl}
            alt={label}
            className="w-full h-full object-cover"
            style={{ objectPosition: settingKey === 'lidia_photo_url' ? 'center 20%' : 'center center' }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-[#9B9B9B]">
            <ImageIcon size={32} />
          </div>
        )}
        {preview && (
          <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
            Vista previa
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-5">
        <p className="font-medium text-[#2A2A2A] text-sm mb-1">{label}</p>
        {currentUrl && !preview && (
          <p className="text-xs text-[#9B9B9B] mb-3 truncate" title={currentUrl}>
            {currentUrl.replace(/\?v=\d+$/, '').split('/').pop()}
          </p>
        )}

        <div className="flex items-center gap-3 mt-3">
          <label className="cursor-pointer flex items-center gap-2 bg-cream-dark hover:bg-cream-darker text-[#2A2A2A] text-sm font-medium px-4 py-2 rounded-full transition-colors">
            <Upload size={14} />
            Elegir foto
            <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFile} />
          </label>

          {file && (
            <button
              onClick={handleUpload}
              disabled={status === 'uploading'}
              className="flex items-center gap-2 bg-rose-accent hover:bg-rose-dark disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
            >
              {status === 'uploading'
                ? <><Loader2 size={14} className="animate-spin" /> Subiendo...</>
                : <><Upload size={14} /> Publicar</>
              }
            </button>
          )}
        </div>

        {status === 'ok' && (
          <p className="flex items-center gap-1.5 text-green-600 text-xs mt-3">
            <CheckCircle size={13} /> Imagen actualizada correctamente. Los cambios ya son visibles en la web.
          </p>
        )}
        {status === 'error' && (
          <p className="flex items-center gap-1.5 text-red-500 text-xs mt-3">
            <AlertCircle size={13} /> {errorMsg}
          </p>
        )}
      </div>
    </div>
  )
}

// Slider con etiqueta y valor
function FilterSlider({ label, value, min, max, unit = '%', onChange }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-[#6B6B6B]">{label}</span>
        <span className="text-xs font-medium text-[#2A2A2A] tabular-nums">{value}{unit}</span>
      </div>
      <input
        type="range" min={min} max={max} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 appearance-none rounded-full cursor-pointer accent-rose-accent"
        style={{ background: `linear-gradient(to right, #C9788A ${((value - min) / (max - min)) * 100}%, #EDD5DC ${((value - min) / (max - min)) * 100}%)` }}
      />
    </div>
  )
}

function HeroFiltersCard({ heroUrl, initialSettings, onSaved }) {
  const [darkness, setDarkness] = useState(parseInt(initialSettings.hero_darkness ?? '45'))
  const [rose,     setRose]     = useState(parseInt(initialSettings.hero_rose     ?? '35'))
  const [posX,     setPosX]     = useState(parseInt(initialSettings.hero_pos_x    ?? '56'))
  const [posY,     setPosY]     = useState(parseInt(initialSettings.hero_pos_y    ?? '42'))
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)

  // Sync when settings load for the first time
  useEffect(() => {
    if (initialSettings.hero_darkness) setDarkness(parseInt(initialSettings.hero_darkness))
    if (initialSettings.hero_rose)     setRose(parseInt(initialSettings.hero_rose))
    if (initialSettings.hero_pos_x)    setPosX(parseInt(initialSettings.hero_pos_x))
    if (initialSettings.hero_pos_y)    setPosY(parseInt(initialSettings.hero_pos_y))
  }, [initialSettings.hero_darkness, initialSettings.hero_rose, initialSettings.hero_pos_x, initialSettings.hero_pos_y])

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    const rows = [
      { key: 'hero_darkness', value: String(darkness) },
      { key: 'hero_rose',     value: String(rose) },
      { key: 'hero_pos_x',    value: String(posX) },
      { key: 'hero_pos_y',    value: String(posY) },
    ]
    const { error } = await supabase.from('site_settings').upsert(rows)
    setSaving(false)
    if (!error) { setSaved(true); onSaved({ darkness, rose, posX, posY }) }
  }

  const d = (darkness / 100).toFixed(2)
  const r = (rose     / 100).toFixed(2)

  return (
    <div className="bg-white rounded-2xl border border-cream-darker/30 overflow-hidden">
      {/* Mini preview en tiempo real */}
      <div className="relative bg-cream-dark" style={{ aspectRatio: '16/7', maxHeight: 200, overflow: 'hidden' }}>
        {heroUrl
          ? <img src={heroUrl} alt="preview" className="w-full h-full object-cover" style={{ objectPosition: `${posX}% ${posY}%` }} />
          : <div className="w-full h-full bg-gradient-to-br from-rose-accent to-rose-dark" />
        }
        {/* Overlays idénticos a los del Hero real */}
        <div className="absolute inset-0" style={{ background: `rgba(0,0,0,${d})` }} />
        <div className="absolute inset-0 bg-gradient-to-l from-black/55 via-black/15 to-transparent" />
        <div className="absolute inset-0" style={{ background: `rgba(165,90,110,${r})` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/45" />
        <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">Vista previa en tiempo real</span>
      </div>

      <div className="p-5">
        <p className="font-medium text-[#2A2A2A] text-sm mb-4">Filtros de la foto principal</p>
        <div className="space-y-4">
          <FilterSlider label="Oscuridad general" value={darkness} min={0} max={80} onChange={setDarkness} />
          <FilterSlider label="Tono rosa"         value={rose}     min={0} max={60} onChange={setRose} />
          <div className="pt-1 border-t border-cream-dark">
            <p className="text-xs text-[#9B9B9B] mb-3">Foco de la imagen — mueve los sliders para reencuadrar la foto</p>
            <div className="space-y-4">
              <FilterSlider label="Posición horizontal" value={posX} min={0} max={100} onChange={setPosX} />
              <FilterSlider label="Posición vertical"   value={posY} min={0} max={100} onChange={setPosY} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-5">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-rose-accent hover:bg-rose-dark disabled:opacity-60 text-white text-sm font-medium px-5 py-2 rounded-full transition-colors"
          >
            {saving ? <><Loader2 size={14} className="animate-spin" /> Guardando...</> : 'Guardar filtros'}
          </button>
          {saved && (
            <p className="flex items-center gap-1.5 text-green-600 text-xs">
              <CheckCircle size={13} /> ¡Guardado! Los cambios ya son visibles en la web.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function ImagesSection() {
  const [settings, setSettings] = useState({})

  useEffect(() => {
    supabase.from('site_settings').select('key, value').then(({ data }) => {
      if (data) setSettings(Object.fromEntries(data.map(r => [r.key, r.value])))
    })
  }, [])

  const handleUploaded = (key, url) => setSettings(prev => ({ ...prev, [key]: url }))
  const handleFilterSaved = ({ darkness, rose, posX, posY }) => {
    setSettings(prev => ({ ...prev, hero_darkness: String(darkness), hero_rose: String(rose), hero_pos_x: String(posX), hero_pos_y: String(posY) }))
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-serif text-xl text-[#2A2A2A]">Imágenes de la web</h2>
        <p className="text-sm text-[#9B9B9B] mt-1">
          Cambia las fotos y ajusta los filtros. Los cambios son inmediatos.
        </p>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ImageUploadCard
            label="Foto principal (Hero)"
            settingKey="hero_image_url"
            currentUrl={settings.hero_image_url}
            onUploaded={(url) => handleUploaded('hero_image_url', url)}
          />
          <ImageUploadCard
            label="Foto de Lidia (Sobre mí)"
            settingKey="lidia_photo_url"
            currentUrl={settings.lidia_photo_url}
            onUploaded={(url) => handleUploaded('lidia_photo_url', url)}
          />
        </div>
        <HeroFiltersCard
          heroUrl={settings.hero_image_url}
          initialSettings={settings}
          onSaved={handleFilterSaved}
        />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Sección: Servicios
// ─────────────────────────────────────────────────────────────────────────────
const ICON_OPTIONS = [
  { key: 'heart',          label: 'Corazón',      Icon: Heart },
  { key: 'leaf',           label: 'Hoja',         Icon: Leaf },
  { key: 'stethoscope',    label: 'Estetoscopio', Icon: Stethoscope },
  { key: 'baby',           label: 'Bebé',         Icon: Baby },
  { key: 'calendar',       label: 'Calendario',   Icon: Calendar },
  { key: 'book-open',      label: 'Libro',        Icon: BookOpen },
  { key: 'message-circle', label: 'Mensaje',      Icon: MessageSquare },
  { key: 'star',           label: 'Estrella',     Icon: Star },
  { key: 'shield',         label: 'Escudo',       Icon: Shield },
  { key: 'sparkles',       label: 'Destellos',    Icon: Sparkles },
  { key: 'moon',           label: 'Luna',         Icon: Moon },
  { key: 'sun',            label: 'Sol',          Icon: Sun },
]

const EMPTY_SERVICE = {
  title: '', description: '', includes: [''], cta: 'Contactar',
  icon: 'heart', featured: false, active: true,
}

function ServiceForm({ service, onSave, onCancel }) {
  const isNew = !service.id
  const [form, setForm] = useState({ ...EMPTY_SERVICE, ...service })
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const addInclude    = () => set('includes', [...form.includes, ''])
  const removeInclude = (i) => set('includes', form.includes.filter((_, j) => j !== i))
  const editInclude   = (i, v) => set('includes', form.includes.map((x, j) => j === i ? v : x))

  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      setError('El título y la descripción son obligatorios.')
      return
    }
    setSaving(true)
    setError('')
    const payload = {
      ...form,
      includes: form.includes.filter(x => x.trim()),
    }
    const { error: err } = isNew
      ? await supabase.from('services').insert(payload)
      : await supabase.from('services').update(payload).eq('id', service.id)
    setSaving(false)
    if (err) setError(err.message)
    else onSave()
  }

  return (
    <div className="bg-white rounded-2xl border border-cream-darker/30 p-6 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif text-lg text-[#2A2A2A]">{isNew ? 'Nuevo servicio' : 'Editar servicio'}</h3>
        <button onClick={onCancel} className="text-[#9B9B9B] hover:text-[#2A2A2A]"><X size={18} /></button>
      </div>

      <div className="space-y-5">
        {/* Título */}
        <div>
          <label className="block text-xs font-medium text-[#6B6B6B] mb-1.5">Título *</label>
          <input
            type="text" value={form.title} onChange={e => set('title', e.target.value)}
            placeholder="Ej: Consulta Puntual"
            className="w-full border border-cream-darker/50 rounded-xl px-4 py-2.5 text-sm text-[#2A2A2A] focus:outline-none focus:border-rose-accent"
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-xs font-medium text-[#6B6B6B] mb-1.5">Descripción *</label>
          <textarea
            value={form.description} onChange={e => set('description', e.target.value)}
            rows={3} placeholder="Breve descripción del servicio..."
            className="w-full border border-cream-darker/50 rounded-xl px-4 py-2.5 text-sm text-[#2A2A2A] focus:outline-none focus:border-rose-accent resize-none"
          />
        </div>

        {/* Qué incluye */}
        <div>
          <label className="block text-xs font-medium text-[#6B6B6B] mb-1.5">Qué incluye</label>
          <div className="space-y-2">
            {form.includes.map((item, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text" value={item} onChange={e => editInclude(i, e.target.value)}
                  placeholder={`Punto ${i + 1}`}
                  className="flex-1 border border-cream-darker/50 rounded-xl px-4 py-2 text-sm text-[#2A2A2A] focus:outline-none focus:border-rose-accent"
                />
                <button onClick={() => removeInclude(i)} className="text-[#9B9B9B] hover:text-red-400 p-2">
                  <X size={14} />
                </button>
              </div>
            ))}
            <button
              onClick={addInclude}
              className="flex items-center gap-1.5 text-xs text-rose-accent hover:text-rose-dark font-medium mt-1"
            >
              <Plus size={13} /> Añadir punto
            </button>
          </div>
        </div>

        {/* Texto del botón */}
        <div>
          <label className="block text-xs font-medium text-[#6B6B6B] mb-1.5">Texto del botón</label>
          <input
            type="text" value={form.cta} onChange={e => set('cta', e.target.value)}
            placeholder="Ej: Reservar consulta"
            className="w-full border border-cream-darker/50 rounded-xl px-4 py-2.5 text-sm text-[#2A2A2A] focus:outline-none focus:border-rose-accent"
          />
        </div>

        {/* Icono */}
        <div>
          <label className="block text-xs font-medium text-[#6B6B6B] mb-2">Icono</label>
          <div className="flex flex-wrap gap-2">
            {ICON_OPTIONS.map(({ key, label, Icon }) => (
              <button
                key={key}
                onClick={() => set('icon', key)}
                title={label}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  form.icon === key
                    ? 'bg-rose-accent text-white shadow-sm'
                    : 'bg-cream-dark text-[#6B6B6B] hover:bg-cream-darker'
                }`}
              >
                <Icon size={16} />
              </button>
            ))}
          </div>
        </div>

        {/* Opciones */}
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)}
              className="accent-rose-accent w-4 h-4" />
            <span className="text-sm text-[#2A2A2A]">Destacado <span className="text-[#9B9B9B] text-xs">(«Más solicitado»)</span></span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={e => set('active', e.target.checked)}
              className="accent-rose-accent w-4 h-4" />
            <span className="text-sm text-[#2A2A2A]">Visible en la web</span>
          </label>
        </div>

        {error && <p className="text-red-500 text-xs">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 bg-rose-accent hover:bg-rose-dark disabled:opacity-60 text-white text-sm font-medium px-6 py-2.5 rounded-full transition-colors"
          >
            {saving ? <><Loader2 size={14} className="animate-spin" /> Guardando...</> : (isNew ? 'Crear servicio' : 'Guardar cambios')}
          </button>
          <button onClick={onCancel} className="text-sm text-[#6B6B6B] hover:text-[#2A2A2A] px-4 py-2.5">Cancelar</button>
        </div>
      </div>
    </div>
  )
}

function ServicesSection() {
  const [services, setServices]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [editing, setEditing]     = useState(null) // null | service obj | 'new'
  const [deleting, setDeleting]   = useState(null) // id to confirm delete

  const load = () => {
    setLoading(true)
    supabase.from('services').select('*').order('sort_order')
      .then(({ data }) => { if (data) setServices(data) })
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const toggleActive = async (s) => {
    await supabase.from('services').update({ active: !s.active }).eq('id', s.id)
    setServices(prev => prev.map(x => x.id === s.id ? { ...x, active: !s.active } : x))
  }

  const move = async (index, dir) => {
    const next = index + dir
    if (next < 0 || next >= services.length) return
    const updated = [...services]
    ;[updated[index], updated[next]] = [updated[next], updated[index]]
    // Reassign sort_order
    const toUpdate = updated.map((s, i) => ({ id: s.id, sort_order: i + 1 }))
    setServices(updated.map((s, i) => ({ ...s, sort_order: i + 1 })))
    await Promise.all(toUpdate.map(({ id, sort_order }) =>
      supabase.from('services').update({ sort_order }).eq('id', id)
    ))
  }

  const confirmDelete = async () => {
    if (!deleting) return
    await supabase.from('services').delete().eq('id', deleting)
    setServices(prev => prev.filter(s => s.id !== deleting))
    setDeleting(null)
  }

  if (loading) return <div className="flex items-center justify-center h-40 text-[#9B9B9B] text-sm"><Loader2 size={18} className="animate-spin mr-2" /> Cargando...</div>

  if (editing) return (
    <div>
      <button onClick={() => setEditing(null)} className="flex items-center gap-1.5 text-sm text-[#9B9B9B] hover:text-rose-accent mb-6">
        ← Volver a servicios
      </button>
      <ServiceForm
        service={editing === 'new' ? {} : editing}
        onSave={() => { setEditing(null); load() }}
        onCancel={() => setEditing(null)}
      />
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-xl text-[#2A2A2A]">Servicios</h2>
          <p className="text-sm text-[#9B9B9B] mt-0.5">{services.filter(s => s.active).length} visibles · {services.length} en total</p>
        </div>
        <button
          onClick={() => setEditing('new')}
          className="flex items-center gap-2 bg-rose-accent hover:bg-rose-dark text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors"
        >
          <Plus size={15} /> Nuevo servicio
        </button>
      </div>

      {/* Lista */}
      <div className="space-y-3">
        {services.map((s, i) => {
          const Icon = ICON_MAP[s.icon] ?? Heart
          return (
            <div key={s.id} className={`bg-white rounded-2xl border p-4 flex items-center gap-4 transition-all ${
              s.active ? 'border-cream-darker/30' : 'border-cream-darker/20 opacity-60'
            }`}>
              {/* Icono */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.featured ? 'bg-rose-accent' : 'bg-rose-soft'}`}>
                <Icon size={18} className={s.featured ? 'text-white' : 'text-rose-accent'} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-sm text-[#2A2A2A] truncate">{s.title}</p>
                  {s.featured && <span className="text-xs bg-rose-soft text-rose-dark px-2 py-0.5 rounded-full">Destacado</span>}
                  {!s.active && <span className="text-xs bg-cream-dark text-[#9B9B9B] px-2 py-0.5 rounded-full">Oculto</span>}
                </div>
                <p className="text-xs text-[#9B9B9B] truncate mt-0.5">{s.includes?.length ?? 0} puntos incluidos</p>
              </div>

              {/* Acciones */}
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => move(i, -1)} disabled={i === 0} className="p-1.5 rounded-lg text-[#9B9B9B] hover:text-[#2A2A2A] hover:bg-cream-dark disabled:opacity-30 transition-colors" title="Subir">
                  <ArrowUp size={14} />
                </button>
                <button onClick={() => move(i, 1)} disabled={i === services.length - 1} className="p-1.5 rounded-lg text-[#9B9B9B] hover:text-[#2A2A2A] hover:bg-cream-dark disabled:opacity-30 transition-colors" title="Bajar">
                  <ArrowDown size={14} />
                </button>
                <button onClick={() => toggleActive(s)} className="p-1.5 rounded-lg text-[#9B9B9B] hover:text-[#2A2A2A] hover:bg-cream-dark transition-colors" title={s.active ? 'Ocultar' : 'Mostrar'}>
                  {s.active ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button onClick={() => setEditing(s)} className="p-1.5 rounded-lg text-[#9B9B9B] hover:text-rose-accent hover:bg-rose-soft/20 transition-colors" title="Editar">
                  <Pencil size={14} />
                </button>
                <button onClick={() => setDeleting(s.id)} className="p-1.5 rounded-lg text-[#9B9B9B] hover:text-red-400 hover:bg-red-50 transition-colors" title="Eliminar">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {services.length === 0 && (
        <div className="text-center py-16 text-[#9B9B9B]">
          <Layers size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No hay servicios todavía.</p>
        </div>
      )}

      {/* Modal confirmación borrado */}
      {deleting && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h4 className="font-serif text-lg text-[#2A2A2A] mb-2">¿Eliminar servicio?</h4>
            <p className="text-sm text-[#6B6B6B] mb-6">Esta acción no se puede deshacer. El servicio desaparecerá de la web.</p>
            <div className="flex gap-3">
              <button onClick={confirmDelete} className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2.5 rounded-full transition-colors">Eliminar</button>
              <button onClick={() => setDeleting(null)} className="flex-1 bg-cream-dark hover:bg-cream-darker text-[#2A2A2A] text-sm font-medium py-2.5 rounded-full transition-colors">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Sección: Suscriptores (guía gratuita)
// ─────────────────────────────────────────────────────────────────────────────
function SubscribersSection({ token }) {
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState('')
  const [sortDir, setSortDir]         = useState('desc')

  useEffect(() => {
    fetch('/api/subscribers', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(({ subscribers }) => { if (subscribers) setSubscribers(subscribers) })
      .finally(() => setLoading(false))
  }, [token])

  const exportSubscribersXLSX = (data) => {
    const rows = data.map(s => ({
      'Email':  s.email,
      'Fecha':  fmt(s.created_at),
      'Origen': s.source ?? 'web',
    }))
    const ws = XLSX.utils.json_to_sheet(rows)
    ws['!cols'] = [{ wch: 36 }, { wch: 22 }, { wch: 16 }]
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Suscriptores')
    XLSX.writeFile(wb, `suscriptores_${new Date().toISOString().slice(0, 10)}.xlsx`)
  }

  const filtered = subscribers
    .filter(s => s.email.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const va = a.created_at; const vb = b.created_at
      return sortDir === 'desc' ? vb.localeCompare(va) : va.localeCompare(vb)
    })

  if (loading) return (
    <div className="flex items-center justify-center h-40 text-[#9B9B9B] text-sm">
      <Loader2 size={18} className="animate-spin mr-2" /> Cargando...
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-xl text-[#2A2A2A]">
            Suscriptores — Guía gratuita
            <span className="ml-2 text-sm font-sans font-normal text-[#9B9B9B]">({filtered.length})</span>
          </h2>
          <p className="text-sm text-[#9B9B9B] mt-0.5">Personas que han descargado la guía de fertilidad</p>
        </div>
        <button
          onClick={() => exportSubscribersXLSX(filtered)}
          className="inline-flex items-center gap-2 text-sm text-rose-accent hover:text-rose-dark border border-rose-soft rounded-full px-4 py-2 transition-colors shrink-0"
        >
          <Download size={14} /> Exportar Excel
        </button>
      </div>

      {/* Buscador + orden */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B9B9B]" />
          <input
            type="text"
            placeholder="Buscar por email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border border-cream-darker rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-rose-accent bg-white transition-colors"
          />
        </div>
        <select
          value={sortDir}
          onChange={e => setSortDir(e.target.value)}
          className="border border-cream-darker rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-accent bg-white text-[#4A4A4A]"
        >
          <option value="desc">Más recientes primero</option>
          <option value="asc">Más antiguos primero</option>
        </select>
      </div>

      {/* Tabla */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-cream-darker/20 py-16 text-center">
          <Users size={32} className="mx-auto mb-3 text-[#C0C0C0]" />
          <p className="text-sm text-[#9B9B9B]">
            {search ? 'No hay resultados para esa búsqueda.' : 'Todavía no hay suscriptores.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-cream-darker/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cream-dark bg-cream/50">
                  <th className="text-left px-4 py-3 font-medium text-[#6B6B6B]">Email</th>
                  <th
                    className="text-left px-4 py-3 font-medium text-[#6B6B6B] cursor-pointer hover:text-rose-accent select-none whitespace-nowrap"
                    onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}
                  >
                    <span className="inline-flex items-center gap-1">
                      Fecha de descarga
                      {sortDir === 'asc'
                        ? <ChevronUp size={13} className="text-rose-accent" />
                        : <ChevronDown size={13} className="text-rose-accent" />}
                    </span>
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-[#6B6B6B]">Origen</th>
                  <th className="px-4 py-3 font-medium text-[#6B6B6B]">Acción</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id} className="border-b border-cream-dark/50 hover:bg-cream/30 transition-colors">
                    <td className="px-4 py-3 text-[#2A2A2A] font-medium">{s.email}</td>
                    <td className="px-4 py-3 text-[#9B9B9B] whitespace-nowrap">{fmtShort(s.created_at)}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-soft/40 text-rose-dark">
                        {s.source ?? 'web'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={`mailto:${s.email}`}
                        className="inline-flex items-center gap-1 text-xs text-rose-accent hover:text-rose-dark font-medium whitespace-nowrap"
                      >
                        <ExternalLink size={12} /> Escribir
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-cream-dark bg-cream/30 text-xs text-[#9B9B9B]">
            {filtered.length} suscriptor{filtered.length !== 1 ? 'es' : ''}
            {search && ` · filtrando de ${subscribers.length} total`}
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Sección: Portada (Hero texts)
// ─────────────────────────────────────────────────────────────────────────────
const HERO_DEFAULTS = {
  hero_badge:         'Asesora especializada en fertilidad',
  hero_title_1:       'Entiende tu ciclo.',
  hero_title_2:       'Acompaña tu proceso.',
  hero_title_3:       'Con respuestas, no silencios.',
  hero_subtitle:      'Entender tu cuerpo es el primer paso para vivir la búsqueda de embarazo con más claridad y tranquilidad. Buscar un embarazo no debería vivirse a ciegas ni en soledad.',
  hero_cta_primary:   'Quiero hablar contigo',
  hero_cta_secondary: 'Conóceme',
  hero_teaser:        '¿Primera vez aquí? Descarga mi guía gratuita sobre fertilidad',
}

const HERO_KEYS = Object.keys(HERO_DEFAULTS)
const HERO_VISIBILITY_KEYS = HERO_KEYS.map(k => `${k}_visible`)
const ALL_HERO_KEYS = [...HERO_KEYS, ...HERO_VISIBILITY_KEYS]

const HERO_LABELS = {
  hero_badge:         'Etiqueta del badge superior',
  hero_title_1:       'Título — línea 1 (blanca)',
  hero_title_2:       'Título — línea 2 (rosa, destacada)',
  hero_title_3:       'Título — línea 3 (blanca)',
  hero_subtitle:      'Subtítulo / descripción',
  hero_cta_primary:   'Botón principal',
  hero_cta_secondary: 'Botón secundario',
  hero_teaser:        'Texto del enlace a la guía gratuita',
}

const HERO_MULTILINE = ['hero_subtitle']

// Visibilidad inicial: todo visible ('1')
const HERO_VISIBILITY_DEFAULTS = Object.fromEntries(HERO_VISIBILITY_KEYS.map(k => [k, '1']))

function PortadaSection() {
  const [form, setForm]       = useState({ ...HERO_DEFAULTS, ...HERO_VISIBILITY_DEFAULTS })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => {
    supabase.from('site_settings').select('key, value')
      .in('key', ALL_HERO_KEYS)
      .then(({ data }) => {
        if (data) {
          const map = Object.fromEntries(data.map(r => [r.key, r.value]))
          setForm(f => ({ ...f, ...map }))
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true); setSaved(false); setError('')
    const rows = [
      ...HERO_KEYS.map(key => ({ key, value: form[key] || HERO_DEFAULTS[key] })),
      ...HERO_VISIBILITY_KEYS.map(key => ({ key, value: form[key] ?? '1' })),
    ]
    const { error: err } = await supabase.from('site_settings').upsert(rows)
    setSaving(false)
    if (err) setError(err.message)
    else setSaved(true)
  }

  const handleReset = (key) => setForm(f => ({ ...f, [key]: HERO_DEFAULTS[key] }))
  const isVisible   = (key) => form[`${key}_visible`] !== '0'
  const toggleVisible = (key) =>
    setForm(f => ({ ...f, [`${key}_visible`]: f[`${key}_visible`] === '0' ? '1' : '0' }))

  if (loading) return (
    <div className="flex items-center justify-center h-40 text-[#9B9B9B] text-sm">
      <Loader2 size={18} className="animate-spin mr-2" /> Cargando...
    </div>
  )

  const groups = [
    { title: 'Badge y título', keys: ['hero_badge', 'hero_title_1', 'hero_title_2', 'hero_title_3'] },
    { title: 'Subtítulo',      keys: ['hero_subtitle'] },
    { title: 'Botones',        keys: ['hero_cta_primary', 'hero_cta_secondary'] },
    { title: 'Enlace guía',    keys: ['hero_teaser'] },
  ]

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h2 className="font-serif text-xl text-[#2A2A2A]">Portada</h2>
        <p className="text-sm text-[#9B9B9B] mt-1">Edita todos los textos de la pantalla de inicio. La foto y los filtros se gestionan en <strong>Imágenes</strong>.</p>
      </div>

      {groups.map(({ title, keys }) => (
        <div key={title} className="bg-white rounded-2xl border border-cream-darker/30 p-6">
          <h3 className="font-medium text-[#2A2A2A] text-sm mb-4">{title}</h3>
          <div className="space-y-4">
            {keys.map(key => {
              const shown = isVisible(key)
              return (
                <div key={key} className={`transition-opacity ${shown ? '' : 'opacity-50'}`}>
                  <div className="flex items-center justify-between mb-1.5 gap-2">
                    <label className="text-xs font-medium text-[#6B6B6B] flex-1">{HERO_LABELS[key]}</label>
                    <div className="flex items-center gap-3 shrink-0">
                      {form[key] !== HERO_DEFAULTS[key] && shown && (
                        <button
                          onClick={() => handleReset(key)}
                          className="text-xs text-[#9B9B9B] hover:text-rose-accent transition-colors"
                        >
                          ↩ Restaurar
                        </button>
                      )}
                      {/* Toggle visible/oculto */}
                      <button
                        onClick={() => toggleVisible(key)}
                        title={shown ? 'Ocultar en la web' : 'Mostrar en la web'}
                        className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border transition-all ${
                          shown
                            ? 'border-green-200 bg-green-50 text-green-600 hover:bg-green-100'
                            : 'border-cream-darker bg-cream-dark text-[#9B9B9B] hover:bg-cream-darker'
                        }`}
                      >
                        {shown ? <Eye size={12} /> : <EyeOff size={12} />}
                        {shown ? 'Visible' : 'Oculto'}
                      </button>
                    </div>
                  </div>
                  {HERO_MULTILINE.includes(key) ? (
                    <textarea
                      rows={3}
                      value={form[key]}
                      disabled={!shown}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      className="w-full border border-cream-darker/50 rounded-xl px-4 py-3 text-sm text-[#2A2A2A] leading-relaxed focus:outline-none focus:border-rose-accent resize-none transition-colors disabled:bg-cream/50 disabled:cursor-not-allowed"
                    />
                  ) : (
                    <input
                      type="text"
                      value={form[key]}
                      disabled={!shown}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      className="w-full border border-cream-darker/50 rounded-xl px-4 py-2.5 text-sm text-[#2A2A2A] focus:outline-none focus:border-rose-accent transition-colors disabled:bg-cream/50 disabled:cursor-not-allowed"
                    />
                  )}
                  {key === 'hero_title_2' && shown && (
                    <p className="text-xs text-[#9B9B9B] mt-1">Esta línea aparece en rosa y en cursiva en la web.</p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {/* Guardar */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-rose-accent hover:bg-rose-dark disabled:opacity-60 text-white text-sm font-medium px-6 py-2.5 rounded-full transition-colors"
        >
          {saving ? <><Loader2 size={14} className="animate-spin" /> Guardando...</> : 'Guardar cambios'}
        </button>
        {saved && (
          <p className="flex items-center gap-1.5 text-green-600 text-xs">
            <CheckCircle size={13} /> ¡Guardado! Los cambios ya son visibles en la web.
          </p>
        )}
        {error && <p className="text-red-500 text-xs">{error}</p>}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Sección: Biografía
// ─────────────────────────────────────────────────────────────────────────────
function BiographySection() {
  const [paragraphs, setParagraphs] = useState(['', '', ''])
  const [credentials, setCredentials] = useState([''])
  const [years, setYears] = useState('15')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.from('site_settings').select('key, value')
      .in('key', ['bio_paragraphs', 'bio_credentials', 'bio_years'])
      .then(({ data }) => {
        if (!data) return
        const map = Object.fromEntries(data.map(r => [r.key, r.value]))
        if (map.bio_years) setYears(map.bio_years)
        try {
          const p = map.bio_paragraphs ? JSON.parse(map.bio_paragraphs) : null
          if (Array.isArray(p) && p.length) setParagraphs(p)
          else setParagraphs([
            'Llevo más de 15 años trabajando en unidades de reproducción asistida, especialmente desde el área de enfermería reproductiva. He estado muy cerca de miles de procesos: tratamientos, decisiones, esperas… y, sobre todo, del impacto emocional que conllevan. Y si hay algo que he aprendido, es que la información —clara, honesta y bien explicada— marca una diferencia enorme.',
            'Durante años viví todo esto desde el lado clínico. Pero en 2022 me convertí en madre, y tiempo después volví a serlo. Esa experiencia transformó por completo mi forma de entender este proceso. Porque cuando eres tú quien desea con todas sus fuerzas, quien espera, quien duda… todo se vive de una manera muy distinta.',
            'En primera persona entendí la incertidumbre, la necesidad de respuestas claras y lo difícil que es, a veces, no tener a quién acudir. Por eso decidí dar un paso más: acompañar desde un lugar diferente, donde puedas preguntar sin miedo y no tengas que sentirte sola en tu proceso.',
          ])
        } catch { /**/ }
        try {
          const c = map.bio_credentials ? JSON.parse(map.bio_credentials) : null
          if (Array.isArray(c) && c.length) setCredentials(c)
          else setCredentials([
            'Enfermera especialista, +15 años en reproducción asistida',
            'Experiencia en FIV, IA, ovodonación y preservación de fertilidad',
            'Acompañamiento emocional y técnico en cada fase del tratamiento',
            'Atención online: accesible desde donde estés',
          ])
        } catch { /**/ }
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true); setSaved(false); setError('')
    const rows = [
      { key: 'bio_paragraphs',  value: JSON.stringify(paragraphs.filter(p => p.trim())) },
      { key: 'bio_credentials', value: JSON.stringify(credentials.filter(c => c.trim())) },
      { key: 'bio_years',       value: years.trim() || '15' },
    ]
    const { error: err } = await supabase.from('site_settings').upsert(rows)
    setSaving(false)
    if (err) setError(err.message)
    else setSaved(true)
  }

  const editParagraph = (i, v) => setParagraphs(ps => ps.map((p, j) => j === i ? v : p))
  const addParagraph = () => setParagraphs(ps => [...ps, ''])
  const removeParagraph = (i) => setParagraphs(ps => ps.filter((_, j) => j !== i))

  const editCredential = (i, v) => setCredentials(cs => cs.map((c, j) => j === i ? v : c))
  const addCredential = () => setCredentials(cs => [...cs, ''])
  const removeCredential = (i) => setCredentials(cs => cs.filter((_, j) => j !== i))

  if (loading) return (
    <div className="flex items-center justify-center h-40 text-[#9B9B9B] text-sm">
      <Loader2 size={18} className="animate-spin mr-2" /> Cargando...
    </div>
  )

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h2 className="font-serif text-xl text-[#2A2A2A]">Biografía</h2>
        <p className="text-sm text-[#9B9B9B] mt-1">Edita el texto y los puntos destacados de la sección «Sobre mí».</p>
      </div>

      {/* Badge años */}
      <div className="bg-white rounded-2xl border border-cream-darker/30 p-6">
        <h3 className="font-medium text-[#2A2A2A] text-sm mb-4 flex items-center gap-2">
          <Star size={15} className="text-rose-accent" /> Badge de experiencia
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#6B6B6B]">+</span>
          <input
            type="number" min="1" max="50" value={years}
            onChange={e => setYears(e.target.value)}
            className="w-20 border border-cream-darker rounded-xl px-3 py-2 text-sm text-center font-medium text-[#2A2A2A] focus:outline-none focus:border-rose-accent"
          />
          <span className="text-sm text-[#6B6B6B]">años en reproducción asistida</span>
          <div className="ml-2 bg-white border border-cream-darker/40 rounded-xl shadow-sm px-4 py-2 text-center">
            <p className="font-serif text-lg font-semibold text-rose-accent">+{years || '15'}</p>
            <p className="text-xs text-[#6B6B6B] leading-tight">años en<br/>rep. asistida</p>
          </div>
        </div>
      </div>

      {/* Párrafos */}
      <div className="bg-white rounded-2xl border border-cream-darker/30 p-6">
        <h3 className="font-medium text-[#2A2A2A] text-sm mb-1 flex items-center gap-2">
          <MessageSquare size={15} className="text-rose-accent" /> Texto de presentación
        </h3>
        <p className="text-xs text-[#9B9B9B] mb-4">Cada bloque es un párrafo independiente en la web.</p>
        <div className="space-y-4">
          {paragraphs.map((p, i) => (
            <div key={i} className="relative group">
              <div className="flex items-start gap-2">
                <span className="mt-3 text-xs text-[#C0C0C0] w-5 shrink-0 text-center">{i + 1}</span>
                <textarea
                  rows={4}
                  value={p}
                  onChange={e => editParagraph(i, e.target.value)}
                  placeholder={`Párrafo ${i + 1}...`}
                  className="flex-1 border border-cream-darker/50 rounded-xl px-4 py-3 text-sm text-[#2A2A2A] leading-relaxed focus:outline-none focus:border-rose-accent resize-none transition-colors"
                />
                {paragraphs.length > 1 && (
                  <button onClick={() => removeParagraph(i)} className="mt-3 p-1.5 text-[#C0C0C0] hover:text-red-400 transition-colors">
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
          <button
            onClick={addParagraph}
            className="flex items-center gap-1.5 text-xs text-rose-accent hover:text-rose-dark font-medium"
          >
            <Plus size={13} /> Añadir párrafo
          </button>
        </div>
      </div>

      {/* Credenciales / hitos CV */}
      <div className="bg-white rounded-2xl border border-cream-darker/30 p-6">
        <h3 className="font-medium text-[#2A2A2A] text-sm mb-1 flex items-center gap-2">
          <CheckCircle2 size={15} className="text-rose-accent" /> Puntos destacados del CV
        </h3>
        <p className="text-xs text-[#9B9B9B] mb-4">Aparecen como lista de ✓ debajo del texto.</p>
        <div className="space-y-2">
          {credentials.map((c, i) => (
            <div key={i} className="flex items-center gap-2">
              <CheckCircle size={14} className="text-rose-accent shrink-0" />
              <input
                type="text"
                value={c}
                onChange={e => editCredential(i, e.target.value)}
                placeholder={`Punto ${i + 1}...`}
                className="flex-1 border border-cream-darker/50 rounded-xl px-4 py-2 text-sm text-[#2A2A2A] focus:outline-none focus:border-rose-accent"
              />
              {credentials.length > 1 && (
                <button onClick={() => removeCredential(i)} className="p-1.5 text-[#C0C0C0] hover:text-red-400 transition-colors">
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addCredential}
            className="flex items-center gap-1.5 text-xs text-rose-accent hover:text-rose-dark font-medium mt-1"
          >
            <Plus size={13} /> Añadir punto
          </button>
        </div>
      </div>

      {/* Guardar */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-rose-accent hover:bg-rose-dark disabled:opacity-60 text-white text-sm font-medium px-6 py-2.5 rounded-full transition-colors"
        >
          {saving ? <><Loader2 size={14} className="animate-spin" /> Guardando...</> : 'Guardar cambios'}
        </button>
        {saved && (
          <p className="flex items-center gap-1.5 text-green-600 text-xs">
            <CheckCircle size={13} /> ¡Guardado! Los cambios ya son visibles en la web.
          </p>
        )}
        {error && <p className="text-red-500 text-xs">{error}</p>}
      </div>
    </div>
  )
}

const NAV_ITEMS = [
  { id: 'stats',       label: 'Resumen',      icon: LayoutDashboard },
  { id: 'submissions', label: 'Solicitudes',  icon: Mail },
  { id: 'subscribers', label: 'Suscriptores', icon: Users },
  { id: 'blog',        label: 'Blog',         icon: BookOpen },
  { id: 'services',    label: 'Servicios',    icon: Layers },
  { id: 'portada',     label: 'Portada',      icon: Sun },
  { id: 'biography',   label: 'Biografía',    icon: MessageSquare },
  { id: 'images',      label: 'Imágenes',     icon: ImageIcon },
]

function Dashboard({ session, onLogout }) {
  const [activeSection, setActiveSection] = useState('stats')
  const [submissions, setSubmissions] = useState([])
  const [subscriberCount, setSubscriberCount] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const headers = { Authorization: `Bearer ${session.access_token}` }
    Promise.all([
      fetch('/api/submissions', { headers }).then(r => r.json()),
      fetch('/api/subscribers', { headers }).then(r => r.json()),
    ]).then(([subData, suscData]) => {
      setSubmissions(subData.submissions ?? [])
      setSubscriberCount((suscData.subscribers ?? []).length)
    }).finally(() => setLoading(false))
  }, [session])

  const handleUpdate = useCallback((updated) => {
    setSubmissions(prev => prev.map(s => s.id === updated.id ? updated : s))
  }, [])

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
              {activeSection === 'stats' && <StatsSection submissions={submissions} subscriberCount={subscriberCount} />}
              {activeSection === 'submissions' && (
                <SubmissionsSection
                  submissions={submissions}
                  onUpdate={handleUpdate}
                  token={session.access_token}
                />
              )}
              {activeSection === 'subscribers' && <SubscribersSection token={session.access_token} />}
              {activeSection === 'blog' && (
                <BlogSection token={session.access_token} />
              )}
              {activeSection === 'services' && <ServicesSection />}
              {activeSection === 'portada' && <PortadaSection />}
              {activeSection === 'biography' && <BiographySection />}
              {activeSection === 'images' && <ImagesSection />}
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
