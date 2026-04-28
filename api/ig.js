import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const LIDIA_EMAIL  = 'hola@fertilidadatulado.com'
const FROM_ADDRESS = 'Fertilidad a Tu Lado <hola@fertilidadatulado.com>'

async function auth(req) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return null
  const { data: { user }, error } = await supabase.auth.getUser(token)
  return error ? null : user
}

export default async function handler(req, res) {

  // POST — envío público del formulario (sin auth)
  if (req.method === 'POST') {
    const { nombre, email, telefono, pais, proceso, objetivo, como_supo } = req.body

    if (!nombre || !email || !telefono || !pais || !objetivo) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' })
    }

    try {
      const { error: dbError } = await supabase
        .from('ig_submissions')
        .insert({ nombre, email, telefono, pais, proceso: proceso || null, objetivo, como_supo: como_supo || null })

      if (dbError) console.error('Error guardando en Supabase:', dbError)

      await resend.emails.send({
        from: FROM_ADDRESS,
        to: LIDIA_EMAIL,
        subject: `Nueva solicitud de acompañamiento de ${nombre}`,
        html: `
          <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#2A2A2A;">
            <div style="background:#C9788A;padding:28px 32px;border-radius:12px 12px 0 0;">
              <h1 style="color:white;margin:0;font-size:22px;font-weight:600;">Nueva solicitud de acompañamiento</h1>
              <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:14px;">Fertilidad a Tu Lado</p>
            </div>
            <div style="background:#FEF9FA;padding:32px;border-radius:0 0 12px 12px;border:1px solid #EDD5DC;">
              <table style="width:100%;border-collapse:collapse;font-size:15px;">
                <tr><td style="padding:10px 0;color:#6B6B6B;width:160px;vertical-align:top;">Nombre</td><td style="padding:10px 0;font-weight:600;">${nombre}</td></tr>
                <tr style="border-top:1px solid #EDD5DC;"><td style="padding:10px 0;color:#6B6B6B;vertical-align:top;">Email</td><td style="padding:10px 0;"><a href="mailto:${email}" style="color:#C9788A;">${email}</a></td></tr>
                <tr style="border-top:1px solid #EDD5DC;"><td style="padding:10px 0;color:#6B6B6B;vertical-align:top;">Teléfono</td><td style="padding:10px 0;">${telefono}</td></tr>
                <tr style="border-top:1px solid #EDD5DC;"><td style="padding:10px 0;color:#6B6B6B;vertical-align:top;">País</td><td style="padding:10px 0;">${pais}</td></tr>
                <tr style="border-top:1px solid #EDD5DC;"><td style="padding:10px 0;color:#6B6B6B;vertical-align:top;">Punto del proceso</td><td style="padding:10px 0;">${proceso || '—'}</td></tr>
                <tr style="border-top:1px solid #EDD5DC;"><td style="padding:10px 0;color:#6B6B6B;vertical-align:top;">Objetivo</td><td style="padding:10px 0;line-height:1.6;">${objetivo.replace(/\n/g, '<br/>')}</td></tr>
                <tr style="border-top:1px solid #EDD5DC;"><td style="padding:10px 0;color:#6B6B6B;vertical-align:top;">¿Cómo supo?</td><td style="padding:10px 0;">${como_supo || '—'}</td></tr>
              </table>
              <div style="margin-top:24px;text-align:center;">
                <a href="mailto:${email}?subject=Re: Tu solicitud de acompañamiento — Fertilidad a Tu Lado"
                   style="display:inline-block;background:#C9788A;color:white;padding:12px 28px;border-radius:999px;text-decoration:none;font-size:14px;font-weight:600;">
                  Responder a ${nombre}
                </a>
              </div>
            </div>
          </div>
        `,
      })

      await resend.emails.send({
        from: FROM_ADDRESS,
        to: email,
        subject: 'He recibido tu solicitud — Lidia · Fertilidad a Tu Lado',
        html: `
          <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#2A2A2A;">
            <div style="background:#C9788A;padding:28px 32px;border-radius:12px 12px 0 0;">
              <h1 style="color:white;margin:0;font-size:22px;font-weight:600;">¡He recibido tu solicitud!</h1>
              <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:14px;">Fertilidad a Tu Lado · Lidia</p>
            </div>
            <div style="background:#FEF9FA;padding:32px;border-radius:0 0 12px 12px;border:1px solid #EDD5DC;">
              <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">Hola <strong>${nombre}</strong>,</p>
              <p style="font-size:15px;line-height:1.7;color:#4A4A4A;margin:0 0 16px;">
                Gracias por rellenar el formulario de acompañamiento. He recibido tu solicitud y me pondré en
                contacto contigo en menos de <strong>24 horas en días laborables</strong>.
              </p>
              <p style="font-size:15px;line-height:1.7;color:#4A4A4A;margin:0 0 24px;">
                Si tienes cualquier duda urgente, puedes escribirme a
                <a href="mailto:${LIDIA_EMAIL}" style="color:#C9788A;">${LIDIA_EMAIL}</a> o en Instagram:
                <a href="https://www.instagram.com/fertilidad_atulado/" style="color:#C9788A;">@fertilidad_atulado</a>.
              </p>
              <div style="background:#F7EAED;border-left:3px solid #C9788A;padding:16px 20px;border-radius:4px;margin-bottom:24px;">
                <p style="margin:0;font-style:italic;color:#A55A6E;font-size:14px;line-height:1.6;">"No estás sola en este camino. Y mereces entender lo que te está pasando."</p>
                <p style="margin:6px 0 0;font-size:13px;color:#C9788A;font-weight:600;">— Lidia</p>
              </div>
              <p style="font-size:13px;color:#9B9B9B;margin:0;">Este correo es una confirmación automática. No es necesario que respondas.</p>
            </div>
          </div>
        `,
      })

      return res.status(200).json({ ok: true })
    } catch (err) {
      console.error('Error en ig POST:', err)
      return res.status(500).json({ error: 'Error al procesar la solicitud' })
    }
  }

  // Rutas protegidas — requieren auth
  const user = await auth(req)
  if (!user) return res.status(401).json({ error: 'No autorizado' })

  // GET — listar solicitudes IG
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('ig_submissions')
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
    const { error } = await supabase
      .from('ig_submissions')
      .update(updates)
      .eq('id', id)
    if (error) return res.status(500).json({ error: 'Error al actualizar' })
    return res.status(200).json({ ok: true })
  }

  // DELETE — eliminar
  if (req.method === 'DELETE') {
    const { id } = req.body
    if (!id) return res.status(400).json({ error: 'Falta el id' })
    const { error } = await supabase
      .from('ig_submissions')
      .delete()
      .eq('id', id)
    if (error) return res.status(500).json({ error: 'Error al eliminar' })
    return res.status(200).json({ ok: true })
  }

  return res.status(405).json({ error: 'Método no permitido' })
}
