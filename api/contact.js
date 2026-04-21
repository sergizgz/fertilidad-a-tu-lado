import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const LIDIA_EMAIL  = 'hola@fertilidadatulado.com'
const FROM_ADDRESS = 'Fertilidad a Tu Lado <hola@fertilidadatulado.com>'

const SERVICE_LABELS = {
  preconcepcion: 'Asesoría Preconcepción',
  fiv: 'Acompañamiento FIV/IAC',
  consulta: 'Consulta Puntual',
  otro: 'No sé, necesito orientación',
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  const { name, email, message, service } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' })
  }

  const serviceLabel = SERVICE_LABELS[service] || 'Sin especificar'

  try {
    // ── 0. Guardar en Supabase ──────────────────────────────────────────────
    const { error: dbError } = await supabase
      .from('contact_submissions')
      .insert({ name, email, service, message })

    if (dbError) {
      console.error('Error guardando en Supabase:', dbError)
      // No bloqueamos el flujo: los emails se envían igualmente
    }

    // ── 1. Correo a Lidia con los datos del formulario ──────────────────────
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: LIDIA_EMAIL,
      subject: `Nueva consulta de ${name} — Fertilidad a Tu Lado`,
      html: `
        <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#2A2A2A;">
          <div style="background:#C9788A;padding:28px 32px;border-radius:12px 12px 0 0;">
            <h1 style="color:white;margin:0;font-size:22px;font-weight:600;">
              Nueva consulta recibida
            </h1>
            <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:14px;">
              Fertilidad a Tu Lado
            </p>
          </div>
          <div style="background:#FEF9FA;padding:32px;border-radius:0 0 12px 12px;border:1px solid #EDD5DC;">
            <table style="width:100%;border-collapse:collapse;font-size:15px;">
              <tr>
                <td style="padding:10px 0;color:#6B6B6B;width:140px;vertical-align:top;">Nombre</td>
                <td style="padding:10px 0;font-weight:600;">${name}</td>
              </tr>
              <tr style="border-top:1px solid #EDD5DC;">
                <td style="padding:10px 0;color:#6B6B6B;vertical-align:top;">Email</td>
                <td style="padding:10px 0;">
                  <a href="mailto:${email}" style="color:#C9788A;">${email}</a>
                </td>
              </tr>
              <tr style="border-top:1px solid #EDD5DC;">
                <td style="padding:10px 0;color:#6B6B6B;vertical-align:top;">Servicio</td>
                <td style="padding:10px 0;">${serviceLabel}</td>
              </tr>
              <tr style="border-top:1px solid #EDD5DC;">
                <td style="padding:10px 0;color:#6B6B6B;vertical-align:top;">Mensaje</td>
                <td style="padding:10px 0;line-height:1.6;">${message.replace(/\n/g, '<br/>')}</td>
              </tr>
            </table>
            <div style="margin-top:24px;text-align:center;">
              <a href="mailto:${email}?subject=Re: Tu consulta en Fertilidad a Tu Lado"
                 style="display:inline-block;background:#C9788A;color:white;padding:12px 28px;border-radius:999px;text-decoration:none;font-size:14px;font-weight:600;">
                Responder a ${name}
              </a>
            </div>
          </div>
        </div>
      `,
    })

    // ── 2. Correo de confirmación a la persona que consulta ─────────────────
    // TODO: cambiar 'to' a simplemente `email` cuando el dominio esté verificado
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: email,
      subject: 'He recibido tu consulta — Lidia · Fertilidad a Tu Lado',
      html: `
        <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#2A2A2A;">
          <div style="background:#C9788A;padding:28px 32px;border-radius:12px 12px 0 0;">
            <h1 style="color:white;margin:0;font-size:22px;font-weight:600;">
              ¡He recibido tu mensaje!
            </h1>
            <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:14px;">
              Fertilidad a Tu Lado · Lidia
            </p>
          </div>
          <div style="background:#FEF9FA;padding:32px;border-radius:0 0 12px 12px;border:1px solid #EDD5DC;">
            <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
              Hola <strong>${name}</strong>,
            </p>
            <p style="font-size:15px;line-height:1.7;color:#4A4A4A;margin:0 0 16px;">
              Gracias por escribirme. He recibido tu consulta y te responderé en menos de
              <strong>24 horas en días laborables</strong>.
            </p>
            <p style="font-size:15px;line-height:1.7;color:#4A4A4A;margin:0 0 24px;">
              Mientras tanto, si tienes cualquier duda urgente puedes escribirme directamente a
              <a href="mailto:${LIDIA_EMAIL}" style="color:#C9788A;">${LIDIA_EMAIL}</a>
              o encontrarme en Instagram:
              <a href="https://www.instagram.com/fertilidad_atulado/" style="color:#C9788A;">@fertilidad_atulado</a>.
            </p>
            <div style="background:#F7EAED;border-left:3px solid #C9788A;padding:16px 20px;border-radius:4px;margin-bottom:24px;">
              <p style="margin:0;font-style:italic;color:#A55A6E;font-size:14px;line-height:1.6;">
                "No estás sola en este camino. Y mereces entender lo que te está pasando."
              </p>
              <p style="margin:6px 0 0;font-size:13px;color:#C9788A;font-weight:600;">— Lidia</p>
            </div>
            <p style="font-size:13px;color:#9B9B9B;margin:0;">
              Este correo es una confirmación automática. No es necesario que respondas a este mensaje.
            </p>
          </div>
        </div>
      `,
    })

    return res.status(200).json({ ok: true })
  } catch (error) {
    console.error('Error enviando email:', error)
    return res.status(500).json({ error: 'Error al enviar el correo' })
  }
}
