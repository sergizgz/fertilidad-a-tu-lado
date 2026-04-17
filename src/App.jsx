import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import AvisoLegal from './pages/AvisoLegal'
import Privacidad from './pages/Privacidad'
import Cookies from './pages/Cookies'
import Privado from './pages/Privado'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta privada — sin Header ni Footer públicos */}
        <Route path="/privado" element={<Privado />} />

        {/* Rutas públicas */}
        <Route path="/*" element={
          <>
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/aviso-legal" element={<AvisoLegal />} />
                <Route path="/privacidad" element={<Privacidad />} />
                <Route path="/cookies" element={<Cookies />} />
              </Routes>
            </main>
            <Footer />
          </>
        } />
      </Routes>
    </BrowserRouter>
  )
}
