import { useEffect } from 'react'

export default function AvisoLegal() {
  useEffect(() => {
    document.title = 'Aviso Legal — Fertilidad a Tu Lado'
    window.scrollTo(0, 0)
    return () => { document.title = 'Fertilidad a Tu Lado' }
  }, [])
  return (
    <div className="max-w-3xl mx-auto px-5 py-32">
      <h1 className="font-serif text-4xl text-[#2A2A2A] mb-8">Aviso Legal</h1>
      <div className="prose prose-slate max-w-none space-y-6 text-[#6B6B6B] leading-relaxed text-sm">
        <p><strong className="text-[#2A2A2A]">Titular:</strong> Lidia [apellidos] · NIF: [NIF]</p>
        <p><strong className="text-[#2A2A2A]">Actividad:</strong> Asesoramiento en fertilidad y reproducción asistida</p>
        <p><strong className="text-[#2A2A2A]">Email de contacto:</strong> hola@fertilidadatulado.es</p>
        <p><strong className="text-[#2A2A2A]">Dominio:</strong> fertilidadatulado.es</p>

        <h2 className="font-serif text-xl text-[#2A2A2A] mt-8">Condiciones de uso</h2>
        <p>El acceso y uso de este sitio web atribuye la condición de usuario e implica la aceptación plena y sin reservas de todas las disposiciones incluidas en este Aviso Legal. El usuario se compromete a hacer un uso adecuado de los contenidos y servicios ofrecidos.</p>

        <h2 className="font-serif text-xl text-[#2A2A2A] mt-8">Propiedad intelectual</h2>
        <p>Todos los contenidos del sitio web (textos, imágenes, diseño gráfico, código fuente) son propiedad de la titular o de terceros que han autorizado su uso, y están protegidos por la legislación española e internacional sobre propiedad intelectual e industrial.</p>

        <h2 className="font-serif text-xl text-[#2A2A2A] mt-8">Responsabilidad</h2>
        <p>La información publicada en este sitio tiene carácter informativo y divulgativo. No sustituye en ningún caso el diagnóstico o tratamiento médico. Ante cualquier duda sobre tu salud, consulta a tu médico especialista.</p>

        <p className="text-xs text-[#9B9B9B] mt-10">Última actualización: {new Date().getFullYear()}</p>
      </div>
    </div>
  )
}
