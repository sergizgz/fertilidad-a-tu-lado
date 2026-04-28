import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'No autorizado' })

  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) return res.status(401).json({ error: 'Sesión inválida' })

  const { id } = req.body
  if (!id) return res.status(400).json({ error: 'Falta el id' })

  const { error } = await supabase.from('ig_submissions').delete().eq('id', id)
  if (error) return res.status(500).json({ error: error.message })

  return res.status(200).json({ ok: true })
}
