import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function auth(req) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return null
  const { data: { user }, error } = await supabase.auth.getUser(token)
  return error ? null : user
}

export default async function handler(req, res) {
  const user = await auth(req)
  if (!user) return res.status(401).json({ error: 'No autorizado' })

  // GET — listar solicitudes
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) return res.status(500).json({ error: 'Error al obtener los datos' })
    return res.status(200).json({ submissions: data })
  }

  // PATCH — actualizar estado / notas
  if (req.method === 'PATCH') {
    const { id, status, notes } = req.body
    if (!id) return res.status(400).json({ error: 'Falta el id' })
    const updates = {}
    if (status !== undefined) updates.status = status
    if (notes  !== undefined) updates.notes  = notes
    const { data, error } = await supabase
      .from('contact_submissions')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) return res.status(500).json({ error: 'Error al actualizar' })
    return res.status(200).json({ submission: data })
  }

  // DELETE — eliminar
  if (req.method === 'DELETE') {
    const { id } = req.body
    if (!id) return res.status(400).json({ error: 'Falta el id' })
    const { error } = await supabase
      .from('contact_submissions')
      .delete()
      .eq('id', id)
    if (error) return res.status(500).json({ error: 'Error al eliminar' })
    return res.status(200).json({ ok: true })
  }

  return res.status(405).json({ error: 'Método no permitido' })
}
