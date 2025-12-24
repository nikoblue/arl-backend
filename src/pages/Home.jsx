import { Link } from 'react-router-dom'
import { Shield, Clock, FileCheck, CreditCard, CheckCircle, Award, Headphones, Sparkles, UserPlus, ClipboardList, MessageCircle, Download, ArrowRight, FileSearch } from 'lucide-react'

function Home() {
  const features = [
    {
      icon: <Clock className="text-arl-blue" size={40} />,
      title: 'Afiliación Rápida',
      description: 'Proceso de afiliación en menos de 15 minutos. Recibe tu certificado al instante.'
    },
    {
      icon: <Shield className="text-arl-blue" size={40} />,
      title: 'Cobertura Completa',
      description: 'Protección ante accidentes y enfermedades laborales con cobertura completa.'
    },
    {
      icon: <FileCheck className="text-arl-blue" size={40} />,
      title: 'Documentos Oficiales',
      description: 'Certificado de afiliación y carnet verificables en línea.'
    },
    {
      icon: <CreditCard className="text-arl-blue" size={40} />,
      title: 'Pago Seguro',
      description: 'Múltiples opciones de pago con transacciones 100% seguras.'
    }
  ]

  const riskLevels = [
    { level: 'I', description: 'Riesgo Mínimo', examples: 'Oficinas, comercio, educación', color: 'bg-green-500', precio: '20.000' },
    { level: 'II', description: 'Riesgo Bajo', examples: 'Restaurantes, hoteles, call centers', color: 'bg-lime-500', precio: '28.000' },
    { level: 'III', description: 'Riesgo Medio', examples: 'Manufactura, hospitales', color: 'bg-yellow-500', precio: '36.000' },
    { level: 'IV', description: 'Riesgo Alto', examples: 'Vigilancia, transporte', color: 'bg-orange-500', precio: '44.000' },
    { level: 'V', description: 'Riesgo Máximo', examples: 'Construcción, minería', color: 'bg-red-500', precio: '52.000' }
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-arl-blue to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Protege tu futuro laboral con ARL
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Afíliate como trabajador independiente de manera rápida y segura. 
                Obtén tu certificado en minutos.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/registro" className="relative inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white font-bold py-4 px-8 rounded-lg shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 animate-bounce hover:animate-none border-2 border-white">
                  <Sparkles size={24} className="animate-spin" style={{animationDuration: '3s'}} />
                  ¡COMENZAR AFILIACIÓN!
                  <Sparkles size={24} className="animate-spin" style={{animationDuration: '3s'}} />
                </Link>
                <a href="#niveles" className="border-2 border-white text-white font-bold py-4 px-8 rounded-lg hover:bg-white hover:text-arl-blue transition-colors">
                  Ver Niveles de Riesgo
                </a>
              </div>
              
              {/* Botón Recuperar Documentos */}
              <div className="mt-6">
                <Link 
                  to="/recuperar-documentos" 
                  className="inline-flex items-center gap-2 text-blue-100 hover:text-white transition-colors text-sm underline underline-offset-4"
                >
                  <FileSearch size={18} />
                  ¿Ya te afiliaste? Recupera tus documentos aquí
                </Link>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-arl-green rounded-full p-3">
                    <CheckCircle className="text-white" size={32} />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">+10,000</p>
                    <p className="text-blue-200 text-sm">Afiliados activos</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-arl-orange rounded-full p-3">
                    <Award className="text-white" size={32} />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">15 minutos</p>
                    <p className="text-blue-200 text-sm">Tiempo de afiliación</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-purple-500 rounded-full p-3">
                    <Headphones className="text-white" size={32} />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Soporte 24/7</p>
                    <p className="text-blue-200 text-sm">Siempre disponibles</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pasos de Afiliación */}
      <section className="py-16 bg-white" id="pasos">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">¿Cómo Afiliarte?</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Sigue estos 4 simples pasos y obtén tu certificado de afiliación ARL en minutos
          </p>
          
          <div className="grid md:grid-cols-4 gap-6">
            {/* Paso 1 */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white text-center transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl h-full">
                <div className="bg-white text-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold shadow-md">
                  1
                </div>
                <div className="bg-white/20 rounded-full p-3 w-fit mx-auto mb-4">
                  <UserPlus size={32} />
                </div>
                <h3 className="font-bold text-lg mb-2">Regístrate</h3>
                <p className="text-blue-100 text-sm">Completa el formulario con tus datos personales básicos</p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                <ArrowRight className="text-gray-300" size={24} />
              </div>
            </div>

            {/* Paso 2 */}
            <div className="relative">
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white text-center transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl h-full">
                <div className="bg-white text-green-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold shadow-md">
                  2
                </div>
                <div className="bg-white/20 rounded-full p-3 w-fit mx-auto mb-4">
                  <ClipboardList size={32} />
                </div>
                <h3 className="font-bold text-lg mb-2">Elige tu Plan</h3>
                <p className="text-green-100 text-sm">Selecciona tu nivel de riesgo y el tiempo de cobertura</p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                <ArrowRight className="text-gray-300" size={24} />
              </div>
            </div>

            {/* Paso 3 */}
            <div className="relative">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white text-center transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl h-full">
                <div className="bg-white text-orange-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold shadow-md">
                  3
                </div>
                <div className="bg-white/20 rounded-full p-3 w-fit mx-auto mb-4">
                  <MessageCircle size={32} />
                </div>
                <h3 className="font-bold text-lg mb-2">Paga por WhatsApp</h3>
                <p className="text-orange-100 text-sm">Contacta a un asesor y realiza el pago de forma segura</p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                <ArrowRight className="text-gray-300" size={24} />
              </div>
            </div>

            {/* Paso 4 */}
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white text-center transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl h-full">
                <div className="bg-white text-purple-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold shadow-md">
                  4
                </div>
                <div className="bg-white/20 rounded-full p-3 w-fit mx-auto mb-4">
                  <Download size={32} />
                </div>
                <h3 className="font-bold text-lg mb-2">Descarga tu Certificado</h3>
                <p className="text-purple-100 text-sm">Recibe tu certificado y carnet en máximo 15 minutos</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link to="/registro" className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-orange-300">
              <Sparkles size={20} />
              ¡Comenzar Ahora!
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">¿Por qué afiliarte con nosotros?</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Somos intermediarios autorizados, garantizando un proceso seguro y eficiente.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center hover:shadow-xl transition-shadow">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Risk Levels Section */}
      <section id="niveles" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Niveles de Riesgo</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Selecciona el nivel de riesgo según tu actividad laboral. El precio varía según el nivel.
          </p>
          <div className="grid md:grid-cols-5 gap-4">
            {riskLevels.map((risk, index) => (
              <div key={index} className="card text-center hover:shadow-xl transition-shadow">
                <div className={`${risk.color} text-white text-2xl font-bold w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  {risk.level}
                </div>
                <h3 className="font-semibold mb-2">{risk.description}</h3>
                <p className="text-gray-500 text-xs mb-2">{risk.examples}</p>
                <p className="text-arl-blue font-bold">${risk.precio}/mes</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-arl-blue text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Listo para proteger tu futuro?</h2>
          <p className="text-blue-100 mb-8 text-lg">
            Comienza tu afiliación ahora y recibe tu certificado en menos de 15 minutos.
          </p>
          <Link to="/registro" className="relative inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white font-bold py-5 px-12 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 animate-pulse hover:animate-none text-xl border-2 border-white">
            <Sparkles size={24} />
            ¡AFILIARSE AHORA!
            <Sparkles size={24} />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
