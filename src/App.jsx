import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Registro from './pages/Registro'
import SeleccionPlan from './pages/SeleccionPlan'
import Pago from './pages/Pago'
import Confirmacion from './pages/Confirmacion'
import Admin from './pages/Admin'
import RecuperarDocumentos from './pages/RecuperarDocumentos'

function App() {
  const [formData, setFormData] = useState({
    // Datos personales
    tipoDocumento: 'CC',
    numeroDocumento: '',
    nombres: '',
    apellidos: '',
    fechaNacimiento: '',
    genero: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    departamento: '',
    // Plan seleccionado
    nivelRiesgo: '',
    tiempoCobertura: '',
    precioTotal: 0,
    // Estado del pago
    codigoPago: '',
    pagado: false,
    fechaPago: null,
  })

  const updateFormData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }))
  }

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/registro" 
              element={<Registro formData={formData} updateFormData={updateFormData} />} 
            />
            <Route 
              path="/seleccion-plan" 
              element={<SeleccionPlan formData={formData} updateFormData={updateFormData} />} 
            />
            <Route 
              path="/pago" 
              element={<Pago formData={formData} updateFormData={updateFormData} />} 
            />
            <Route 
              path="/confirmacion" 
              element={<Confirmacion formData={formData} />} 
            />
            <Route path="/admin" element={<Admin />} />
            <Route path="/recuperar-documentos" element={<RecuperarDocumentos />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
