import { useEffect } from 'react'

export default function Cookies() {
  useEffect(() => {
    document.title = 'Política de Cookies — Fertilidad a Tu Lado'
    window.scrollTo(0, 0)
    return () => { document.title = 'Fertilidad a Tu Lado' }
  }, [])
  return (
    <div className="max-w-3xl mx-auto px-5 py-32">
      <h1 className="font-serif text-4xl text-[#2A2A2A] mb-8">Política de Cookies</h1>
      <div className="space-y-6 text-[#6B6B6B] leading-relaxed text-sm">
        <p>Este sitio web utiliza cookies propias y de terceros para mejorar la experiencia de usuario y analizar el tráfico.</p>

        <h2 className="font-serif text-xl text-[#2A2A2A] mt-8">¿Qué son las cookies?</h2>
        <p>Las cookies son pequeños archivos de texto que los sitios web almacenan en tu navegador. Permiten recordar tus preferencias y analizar cómo se usa el sitio.</p>

        <h2 className="font-serif text-xl text-[#2A2A2A] mt-8">Tipos de cookies utilizadas</h2>
        <table className="w-full text-xs border border-cream-darker/30 rounded-xl overflow-hidden">
          <thead className="bg-cream-dark">
            <tr>
              <th className="text-left p-3 text-[#2A2A2A]">Tipo</th>
              <th className="text-left p-3 text-[#2A2A2A]">Finalidad</th>
              <th className="text-left p-3 text-[#2A2A2A]">Duración</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-cream-darker/20">
              <td className="p-3">Técnicas</td>
              <td className="p-3">Funcionamiento básico del sitio</td>
              <td className="p-3">Sesión</td>
            </tr>
            <tr className="border-t border-cream-darker/20">
              <td className="p-3">Analíticas</td>
              <td className="p-3">Medir el tráfico y uso del sitio</td>
              <td className="p-3">2 años</td>
            </tr>
          </tbody>
        </table>

        <h2 className="font-serif text-xl text-[#2A2A2A] mt-8">Cómo desactivar las cookies</h2>
        <p>Puedes configurar tu navegador para rechazar o eliminar cookies. Consulta la ayuda de tu navegador para más información. Ten en cuenta que desactivar las cookies puede afectar al funcionamiento del sitio.</p>

        <p className="text-xs text-[#9B9B9B] mt-10">Última actualización: {new Date().getFullYear()}</p>
      </div>
    </div>
  )
}
