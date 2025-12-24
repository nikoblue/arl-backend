import { Shield, MapPin, Mail, FileSearch } from 'lucide-react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Logo y descripción */}
          <div className="text-center md:text-left">
            <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
              <div className="bg-arl-blue p-2 rounded-lg">
                <Shield className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-bold">ARL Riesgos Profesionales</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Somos intermediarios autorizados para la afiliación a ARL. 
              Brindamos un servicio rápido y confiable para proteger a los trabajadores independientes.
            </p>
          </div>
          
          {/* Contacto y Horario */}
          <div className="text-center md:text-left">
            <h4 className="font-semibold mb-3 md:mb-4">Contacto</h4>
            <div className="space-y-2 text-gray-400 text-sm">
              <p className="flex items-center gap-2 justify-center md:justify-start">
                <MapPin size={16} className="flex-shrink-0" />
                <span>Colombia</span>
              </p>
              <p className="flex items-center gap-2 justify-center md:justify-start">
                <Mail size={16} className="flex-shrink-0" />
                <a href="mailto:soportearlya@gmail.com" className="hover:text-white transition-colors break-all">
                  soportearlya@gmail.com
                </a>
              </p>
            </div>
            <div className="mt-4 text-gray-400 text-xs md:text-sm bg-gray-700/50 rounded-lg p-3 md:p-4 md:bg-transparent md:rounded-none">
              <p className="font-medium text-gray-300 mb-2">📅 Horario de Afiliación:</p>
              <div className="flex flex-col sm:flex-row sm:gap-4 md:flex-col md:gap-0">
                <p>Lun-Vie: 6:00 AM - 6:00 PM</p>
                <p>Sáb: 7:00 AM - 1:00 PM</p>
              </div>
              <p className="mt-2 text-yellow-400 text-xs leading-relaxed">
                * Afiliaciones fuera de horario se procesan el siguiente día hábil.
              </p>
            </div>
          </div>
          {/* Enlaces Importantes */}
          <div className="text-center md:text-left">
            <h4 className="font-semibold mb-3 md:mb-4">Enlaces Importantes</h4>
            <div className="space-y-3 text-gray-400 text-sm">
              <Link 
                to="/recuperar-documentos"
                className="hover:text-white transition-colors flex items-center gap-2 justify-center md:justify-start bg-gray-700/50 md:bg-transparent rounded-lg p-3 md:p-0"
              >
                <FileSearch size={18} className="flex-shrink-0" />
                <span>Recuperar mis Documentos</span>
              </Link>
              <a 
                href="https://www.sura.co/arl/afiliacion/verificacion" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white transition-colors flex items-center justify-center md:justify-start"
              >
                Verificar Autenticidad de Afiliación
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} ARL Riesgos Profesionales. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
