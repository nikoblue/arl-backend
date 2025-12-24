import { Link } from 'react-router-dom'
import { Mail, Sparkles } from 'lucide-react'

function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="bg-arl-blue text-white py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Mail size={14} />
              soportearlya@gmail.com
            </span>
          </div>
          <div className="text-xs">
            <span>Lun-Vie: 6:00 AM - 6:00 PM | Sáb: 7:00 AM - 1:00 PM</span>
          </div>
        </div>
      </div>
      <nav className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            {/* LOGO: Coloca tu imagen en public/logo.png */}
            <img 
              src="/logo.png" 
              alt="ARL Ya Logo" 
              className="h-16 md:h-20 w-auto object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div>
              <h1 className="text-xl font-bold text-gray-800">ARL Riesgos Profesionales</h1>
              <p className="text-sm text-gray-500">Tu seguridad, nuestra prioridad</p>
            </div>
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-gray-600 hover:text-arl-blue font-medium transition-colors">
              Inicio
            </Link>
            <Link to="/registro" className="relative inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-pulse hover:animate-none border-2 border-orange-300">
              <Sparkles size={20} />
              ¡Afiliarse Ahora!
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full animate-bounce">HOT</span>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
