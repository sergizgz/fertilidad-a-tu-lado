import { useEffect } from 'react'
import SEO from '../components/SEO'

export default function Privacidad() {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  return (
    <div className="max-w-3xl mx-auto px-5 py-32">
      <SEO
        title="Política de Privacidad"
        description="Política de privacidad de Fertilidad a Tu Lado — cómo tratamos tus datos personales conforme al RGPD y la LOPDGDD."
        canonical="/privacidad"
      />
      <h1 className="font-serif text-4xl text-[#2A2A2A] mb-8">Política de Privacidad</h1>
      <div className="space-y-6 text-[#6B6B6B] leading-relaxed text-sm">
        <p>De conformidad con el Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD), te informamos sobre el tratamiento de tus datos personales.</p>

        <h2 className="font-serif text-xl text-[#2A2A2A] mt-8">Responsable del tratamiento</h2>
        <p><strong className="text-[#2A2A2A]">Identidad:</strong> Lidia [apellidos] · NIF: [NIF]<br />
        <strong className="text-[#2A2A2A]">Email:</strong> hola@fertilidadatulado.com</p>

        <h2 className="font-serif text-xl text-[#2A2A2A] mt-8">Finalidad del tratamiento</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Gestionar las consultas recibidas a través del formulario de contacto.</li>
          <li>Prestar los servicios de asesoramiento contratados.</li>
          <li>Envío de comunicaciones relacionadas con los servicios, si has dado tu consentimiento.</li>
        </ul>

        <h2 className="font-serif text-xl text-[#2A2A2A] mt-8">Base legal</h2>
        <p>El consentimiento del interesado (art. 6.1.a RGPD) y la ejecución de un contrato (art. 6.1.b RGPD).</p>

        <h2 className="font-serif text-xl text-[#2A2A2A] mt-8">Conservación de datos</h2>
        <p>Los datos se conservarán durante el tiempo necesario para la prestación del servicio y el cumplimiento de las obligaciones legales aplicables.</p>

        <h2 className="font-serif text-xl text-[#2A2A2A] mt-8">Tus derechos</h2>
        <p>Puedes ejercer tus derechos de acceso, rectificación, supresión, limitación, portabilidad y oposición enviando un email a hola@fertilidadatulado.com con asunto "Protección de datos".</p>

        <h2 className="font-serif text-xl text-[#2A2A2A] mt-8">Datos especialmente protegidos</h2>
        <p>Dado que los servicios están relacionados con la salud, los datos que compartas tienen la categoría de datos especialmente protegidos (art. 9 RGPD). Solo se tratan con tu consentimiento explícito y para la prestación del servicio.</p>

        <p className="text-xs text-[#9B9B9B] mt-10">Última actualización: {new Date().getFullYear()}</p>
      </div>
    </div>
  )
}
