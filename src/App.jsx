import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import AvisoLegal from './pages/AvisoLegal'
import Privacidad from './pages/Privacidad'
import Cookies from './pages/Cookies'
import Privado from './pages/Privado'
import Formulario from './pages/Formulario'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas sin Header ni Footer */}
        <Route path="/privado" element={<Privado />} />
        <Route path="/formulario" element={<Formulario />} />

        {/* Rutas públicas */}
        <Route path="/*" element={
          <>
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
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
