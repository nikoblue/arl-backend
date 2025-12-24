import { Shield, MapPin, Mail, FileSearch } from 'lucide-react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
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
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <div className="space-y-2 text-gray-400 text-sm">
              <p className="flex items-center gap-2">
                <MapPin size={16} />
                Colombia
              </p>
              <p className="flex items-center gap-2">
                <Mail size={16} />
                soportearlya@gmail.com
              </p>
            </div>
            <div className="mt-4 text-gray-400 text-xs">
              <p className="font-medium text-gray-300 mb-1">Horario de Afiliación:</p>
              <p>Lun-Vie: 6:00 AM - 6:00 PM</p>
              <p>Sáb: 7:00 AM - 1:00 PM</p>
              <p className="mt-2 text-yellow-400">* Afiliaciones fuera de horario se procesan el siguiente día hábil a primera hora.</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Enlaces Importantes</h4>
            <div className="space-y-2 text-gray-400 text-sm">
              <p>
                <Link 
                  to="/recuperar-documentos"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <FileSearch size={16} />
                  Recuperar mis Documentos
                </Link>
              </p>
              <p>
                <a 
                  href="https://www.sura.co/arl/afiliacion/verificacion" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Verificar Autenticidad de Afiliación
                </a>
              </p>
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
