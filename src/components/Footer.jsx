import { Link } from 'react-router-dom'
import { AtSign, Mail } from 'lucide-react'

function LogoIcon({ size = 28 }) {
  return (
    <svg
      width={size}
      height={Math.round(size * 864 / 992)}
      viewBox="0 0 992 864"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m 466.6,234 c -48,8 -88.6,30.8 -121.4,68.1 -15.7,17.7 -29.3,41.1 -38,64.9 -7.6,20.9 -10.9,38.2 -11.9,62 -2.2,55.8 20.1,111.8 60.6,152.1 18.1,18 34.4,29.4 55.9,39.3 16.5,7.5 25.1,9.7 37.2,9.7 16.6,0 24.1,-3.2 35.1,-14.9 9.6,-10.1 15.7,-21.8 19.9,-38 2.8,-11.1 3.9,-19.5 5,-38.7 0.5,-9.4 1.6,-19.7 2.5,-23 3.7,-14.3 12.5,-26.1 24.2,-32.2 3.2,-1.7 11.8,-5.2 19.2,-7.8 23.1,-8 31.1,-12.5 46.3,-25.9 18.5,-16.3 30.5,-36.1 35.8,-58.9 2.6,-11.2 2.4,-24.9 -0.4,-32.7 -3.4,-9.3 -11.9,-17.3 -22,-20.6 -3.7,-1.3 -7.6,-1.5 -17.5,-1.2 -12.1,0.4 -13.3,0.6 -28,5.7 -8.4,2.8 -15.5,5.1 -15.6,4.9 -0.1,-0.2 -1.9,-4.1 -3.9,-8.8 -11.3,-26.3 -28.6,-42.7 -46.3,-43.8 -21.1,-1.4 -43.1,17.1 -53.9,45.3 -1.9,5 -3.4,7.5 -4.5,7.5 -0.8,0 -4.3,-1.1 -7.6,-2.4 -3.3,-1.4 -10.7,-3.7 -16.4,-5.2 -13.7,-3.6 -30.3,-3.8 -39,-0.5 -10.6,4 -17.7,12.5 -21.4,25.6 -2.7,9 -1.6,19.5 3.6,35 5.9,17.9 12.1,27.6 27.9,43.5 18.7,18.9 30.3,25.8 60.5,36.1 17.5,5.9 20.9,7.4 28.8,12.7 5.5,3.6 11.3,12.3 14,20.6 2,6.4 2.2,9 2,25.1 -0.1,19 -1.2,26.7 -5.9,42.5 -5.2,17.1 -14.9,30.7 -25.9,36.1 -4.4,2.1 -6.3,2.4 -16.5,2.4 -13.8,-0.1 -17.8,-1.3 -38.5,-11.6 -16.2,-8 -28.1,-16.2 -41.3,-28.5 -20.1,-18.7 -40,-48 -49.5,-73 -18.3,-47.9 -17.5,-96.2 2.4,-144.6 3.5,-8.5 16.6,-31.9 22.3,-39.8 10,-13.8 24,-27.2 46.3,-44.3 7.3,-5.6 27.2,-16.2 38.8,-20.7 28.6,-11 64.2,-15.5 93.5,-11.6 14,1.9 37,7.8 49.6,12.7 32.1,12.6 66.7,41 86.9,71.4 16,24.1 26.9,51.8 31,79 2.2,14.9 2,43.9 -0.5,59 -4,24.4 -12.8,48.7 -25.1,69.1 -8.4,13.9 -14.4,21.7 -26.5,34.4 -36.4,37.9 -86.8,59.8 -137.9,60 -9.2,0.1 -11.5,1.2 -11.5,5.8 0,5 2.1,5.5 20.4,4.9 24.8,-0.8 40.5,-4.2 65.4,-14.1 46.8,-18.8 85.8,-55.1 107.7,-100.1 20.4,-42 26.2,-87.3 17,-132.5 -6.4,-31.6 -20.6,-61.4 -41.4,-87.2 -10.2,-12.7 -32.4,-32.8 -46.3,-41.9 -25.4,-16.7 -47.5,-24.8 -86.4,-31.8 -9.7,-1.8 -46,-1.2 -58.8,0.9 z m 45.3,74.3 c 6.2,2.9 17,13.9 21.5,21.9 4.2,7.6 8.6,18.3 8.6,21 0,1 -5.5,7.3 -12.3,14.1 -12.7,12.6 -21.4,24.2 -26.2,35.1 -1.4,3.1 -3,5.4 -3.5,5.1 -0.6,-0.4 -2.2,-3 -3.6,-5.8 -7.7,-15.4 -25.2,-36.1 -35.2,-41.7 -4.9,-2.7 -5,-3.6 -2.1,-12.3 7.7,-23.1 27.9,-41.9 43.3,-40.1 2.6,0.3 6.9,1.5 9.5,2.7 z m 102.8,41 c 10,5.3 13.9,13.9 13,28.6 -0.80718,13.61435 -5.58145,27.25766 -13.63722,39.82359 C 607.14825,428.50934 597.81614,438.50135 586.5,447 c -11.2,8.4 -18.3,12 -36,18.2 -22.7,7.9 -34,15.7 -42.2,29 -2,3.2 -4.1,5.8 -4.7,5.8 -0.6,0 -2.4,-2 -3.9,-4.4 -7.9,-12.5 -20.5,-20 -50.4,-30.1 -11.4,-3.8 -19.9,-7.3 -25.1,-10.5 -19.4,-11.5 -38.3,-31.7 -46.1,-49.3 -1.6,-3.4 -4.1,-10.7 -5.6,-16.1 -6,-21.5 -0.8,-35.7 14.9,-40.6 2.6,-0.8 7.8,-1.1 15.5,-0.8 13.5,0.6 24.4,3.8 39.5,11.7 23,11.9 42.3,34.7 48.5,57.1 1.3,4.7 2.5,13.4 3.2,23.5 0.7,10.8 1.5,16.7 2.5,18.2 1.8,2.8 6.8,3.1 8,0.5 0.4,-0.9 0.9,-8.7 1,-17.2 0.2,-12.8 0.6,-16.7 2.4,-22.5 8.4,-26.5 29.5,-51.6 52.1,-61.8 10,-4.6 21.4,-8.7 26.9,-9.7 7.5,-1.4 24,-0.6 27.7,1.3 z" />
      <path d="m 398.7,490.3 c -4.3,0.8 -7.5,2.1 -8.9,3.5 -2.1,2 -2.1,2.5 -1,9.6 4.2,26.9 26.7,50.3 55.2,57.5 14.6,3.7 33.8,5.1 39.8,3 3.9,-1.3 4.6,-3.5 3.7,-11.6 -1.4,-13.6 -6.9,-24.5 -17.9,-35.6 -12.5,-12.6 -27,-21.5 -41.1,-25.2 -8.2,-2.1 -21.8,-2.7 -29.8,-1.2 z m 23.5,11.3 c 10.7,2.4 20,6.7 28.1,12.8 13.1,9.8 19.7,18.3 24.4,31.3 l 2.3,6.3 -2.3,1.1 c -3.4,1.5 -23.2,-1.3 -33.7,-4.7 -11,-3.7 -21.9,-11 -28.7,-19.4 -9.2,-11.5 -14.6,-25.6 -10.6,-27.9 2.7,-1.6 12.4,-1.3 20.5,0.5 z m 152,-1.1 c -15.7,5.4 -27.4,12.9 -38.3,24.1 -11.8,12.3 -19.6,26.9 -20.6,38.5 -0.9,10.2 0,10.9 13.7,10.9 20.5,0 35.2,-5.5 54.3,-20.4 15.1,-11.9 26.6,-31.9 26.7,-46.7 0,-7.8 -0.9,-8.4 -15.7,-8.7 -11.5,-0.2 -13.5,0 -20.1,2.3 z m 23.6,11.5 c 0.4,3.4 -7.1,17.7 -12.8,24.4 -5.4,6.3 -15.5,14.3 -22.8,18 -9,4.6 -22.8,8.6 -29.3,8.6 -6.9,0 -7.2,-0.7 -3.5,-8.6 7.8,-16.7 20.8,-30.4 36.1,-38 11,-5.5 17.8,-7.3 26,-7.1 5.6,0.2 6,0.4 6.3,2.7 z" />
    </svg>
  )
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#2A2A2A] text-white/70 pt-14 pb-8">
      <div className="max-w-6xl mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-0 mb-4">
              <LogoIcon size={120} />
              <span className="font-serif text-white text-lg">
                Fertilidad <span className="text-rose-soft">a Tu Lado</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Acompañamiento especializado en fertilidad y reproducción asistida. Porque este camino no deberías recorrerlo sola.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-medium mb-4 text-sm uppercase tracking-wider">Navegación</h4>
            <ul className="space-y-2 text-sm">
              {['Sobre mí', 'Servicios', 'Cómo funciona', 'Testimonios', 'Contacto'].map(item => (
                <li key={item}>
                  <a
                    href={`/#${item.toLowerCase().replace(' ', '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`}
                    className="hover:text-rose-soft transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
              <li>
                <Link to="/blog" className="hover:text-rose-soft transition-colors">Blog</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-medium mb-4 text-sm uppercase tracking-wider">Contacto</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="https://www.instagram.com/fertilidad_atulado/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-rose-soft transition-colors">
                  <AtSign size={16} />
                  @fertilidad_atulado
                </a>
              </li>
              <li>
                <a href="mailto:hola@fertilidadatulado.es" className="flex items-center gap-2 hover:text-rose-soft transition-colors">
                  <Mail size={16} />
                  hola@fertilidadatulado.es
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <span>© {year} Fertilidad a Tu Lado · Lidia</span>
          <div className="flex gap-6">
            <Link to="/aviso-legal" className="hover:text-white/70 transition-colors">Aviso Legal</Link>
            <Link to="/privacidad" className="hover:text-white/70 transition-colors">Privacidad</Link>
            <Link to="/cookies" className="hover:text-white/70 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
