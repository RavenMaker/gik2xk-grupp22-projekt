import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Menu from './pages/Meny.jsx'
import Singin from './pages/Singin.jsx'
import Admin from './pages/Admin.jsx'
import './App.css'

function App() {
  return (
    <>
      <BrowserRouter>
          {/* Navbar som alltid syns */}
          <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
            <div class="container">
              <Link class="navbar-brand fw-bold" to="/">Z krog Restaurang</Link>
              <div class="collapse navbar-collapse" id="navMenu">
                <ul class="navbar-nav ms-auto">
                  <li class="nav-item">
                    <Link class="nav-link active fw-semibold" to="/about">Om oss</Link>
                  </li>
                  <li class="nav-item">
                    <Link class="nav-link" to="/menu">menu</Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
          
          {/* Här byter sig sidan beroende på URL */}
          <Routes>
            <Route path="/"        element={<Home />} />
            <Route path="/about"   element={<About />} />
            <Route path="/menu"   element={<Menu />} />
            <Route path="/singIn"   element={<Singin />} />
            <Route path="/admin"   element={<Admin />} />
          </Routes>

            <footer class="site-footer mt-5">
              <div class="container">
                <div class="row align-items-center text-center text-md-start">
                  <div class="col-md-6 mb-3 mb-md-0">
                    <h5 class="footer-title mb-2">Z krog Restaurang</h5>
                    <p class="mb-0 footer-text">God mat, snabb service och en meny för hela familjen</p>
                  </div>

                  <div class="col-md-6">
                    <ul class="footer-links list-unstyled d-flex flex-column flex-md-row justify-content-center justify-content-md-end gap-3 mb-0">
                      <li><Link to="/about" class="footer-link">Om oss</Link></li>
                      <li><Link to="/contact" class="footer-link">Kontakt</Link></li>
                      <li><Link class="nav-link" to="/singIn">Admin login</Link></li>
                    </ul>
                  </div>
                </div>
              </div>
            </footer>
        </BrowserRouter>
    </>
  )
}

export default App
