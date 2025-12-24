import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import StepIndicator from '../components/StepIndicator'
import { CheckCircle, Clock, Download, ExternalLink, Shield, FileText, CreditCard, AlertTriangle, RefreshCw } from 'lucide-react'
import { API_URL, UPLOADS_URL } from '../config'

function Confirmacion({ formData }) {
  const [tiempoRestante, setTiempoRestante] = useState(15 * 60) // 15 minutos en segundos
  const [documentos, setDocumentos] = useState({
    certificadoUrl: formData.certificadoUrl || null,
    carnetUrl: formData.carnetUrl || null
  })
  const [verificando, setVerificando] = useState(false)
  const steps = ['Datos Personales', 'Selección de Plan', 'Pago', 'Confirmación']

  // Verificar si hay documentos disponibles
  const verificarDocumentos = async () => {
    if (!formData.codigoPago) return
    
    setVerificando(true)
    try {
      const res = await fetch(`${API_URL}/afiliaciones/verificar/${formData.codigoPago}`)
      const data = await res.json()
      
      if (data.success) {
        setDocumentos({
          certificadoUrl: data.certificadoUrl,
          carnetUrl: data.carnetUrl
        })
      }
    } catch (error) {
      console.error('Error verificando documentos:', error)
    }
    setVerificando(false)
  }

  useEffect(() => {
    if (!formData.pagado) return

    // Verificar documentos al cargar
    verificarDocumentos()

    // Verificar cada 30 segundos si no hay documentos
    const interval = setInterval(() => {
      if (!documentos.certificadoUrl || !documentos.carnetUrl) {
        verificarDocumentos()
      }
      
      setTiempoRestante(prev => {
        if (prev <= 0) return 0
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [formData.pagado])

  const formatTiempo = (segundos) => {
    const mins = Math.floor(segundos / 60)
    const secs = segundos % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const generarNumeroAfiliacion = () => {
    const fecha = new Date()
    return `ARL-${fecha.getFullYear()}${(fecha.getMonth() + 1).toString().padStart(2, '0')}${fecha.getDate().toString().padStart(2, '0')}-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`
  }

  const numeroAfiliacion = generarNumeroAfiliacion()

  const nivelesInfo = {
    'I': 'Riesgo Mínimo',
    'II': 'Riesgo Bajo',
    'III': 'Riesgo Medio',
    'IV': 'Riesgo Alto',
    'V': 'Riesgo Máximo'
  }

  const descargarDocumento = (tipo) => {
    const url = tipo === 'certificado' ? documentos.certificadoUrl : documentos.carnetUrl
    if (url) {
      window.open(`${UPLOADS_URL}${url}`, '_blank')
    }
  }

  const documentosListos = documentos.certificadoUrl && documentos.carnetUrl

  if (!formData.pagado) {
    return (
      <div className="py-12 bg-gray-50 min-h-screen">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="card">
            <AlertTriangle className="mx-auto text-yellow-500 mb-4" size={64} />
            <h2 className="text-2xl font-bold mb-4">Pago No Completado</h2>
            <p className="text-gray-600 mb-6">
              No hemos detectado un pago completado. Por favor, completa el proceso de pago para continuar.
            </p>
            <Link to="/pago" className="btn-primary">
              Ir a Pago
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <StepIndicator steps={steps} currentStep={3} />
        
        {/* Mensaje de Éxito */}
        <div className="card text-center mb-6">
          <div className="bg-arl-green w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-white" size={48} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">¡Pago Exitoso!</h1>
          <p className="text-gray-600 mb-4">
            Tu afiliación a ARL ha sido procesada correctamente.
          </p>
          <div className="bg-blue-50 rounded-lg p-4 inline-block">
            <p className="text-sm text-gray-500">Número de Afiliación</p>
            <p className="text-xl font-bold text-arl-blue">{numeroAfiliacion}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Resumen de Afiliación */}
          <div className="card">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Shield className="text-arl-blue" size={20} />
              Resumen de Afiliación
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Afiliado:</span>
                <span className="font-medium">{formData.nombres} {formData.apellidos}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Documento:</span>
                <span className="font-medium">{formData.tipoDocumento} {formData.numeroDocumento}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Nivel de Riesgo:</span>
                <span className="font-medium">Nivel {formData.nivelRiesgo} - {nivelesInfo[formData.nivelRiesgo]}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Cobertura:</span>
                <span className="font-medium">{formData.tiempoCobertura} {formData.tiempoCobertura === '1' ? 'mes' : 'meses'}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Total Pagado:</span>
                <span className="font-bold text-arl-green">${formData.precioTotal?.toLocaleString('es-CO')} COP</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Email de Confirmación:</span>
                <span className="font-medium">{formData.email}</span>
              </div>
            </div>
          </div>

          {/* Documentos */}
          <div className="card">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <FileText className="text-arl-blue" size={20} />
              Documentos de Afiliación
            </h3>

            {!documentosListos ? (
              <div className="text-center py-6">
                <div className="animate-pulse">
                  <Clock className="mx-auto text-arl-orange mb-4" size={48} />
                </div>
                <p className="text-gray-600 mb-2">Esperando documentos del asesor...</p>
                <p className="text-sm text-gray-500 mb-4">
                  El asesor subirá tu certificado y carnet. Tiempo estimado: máximo 15 minutos
                </p>
                <div className="bg-gray-100 rounded-lg p-4 mb-4">
                  <p className="text-2xl font-bold text-arl-blue">{formatTiempo(tiempoRestante)}</p>
                  <p className="text-xs text-gray-500">Tiempo restante máximo</p>
                </div>
                
                <button
                  onClick={verificarDocumentos}
                  disabled={verificando}
                  className="btn-secondary flex items-center gap-2 mx-auto"
                >
                  <RefreshCw size={16} className={verificando ? 'animate-spin' : ''} />
                  {verificando ? 'Verificando...' : 'Verificar Documentos'}
                </button>

                {/* Mostrar documentos parciales si hay alguno */}
                {(documentos.certificadoUrl || documentos.carnetUrl) && (
                  <div className="mt-4 space-y-2">
                    {documentos.certificadoUrl && (
                      <button
                        onClick={() => descargarDocumento('certificado')}
                        className="w-full flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle className="text-green-500" size={16} />
                          <span className="text-sm font-medium">Certificado disponible</span>
                        </div>
                        <Download className="text-green-600" size={16} />
                      </button>
                    )}
                    {documentos.carnetUrl && (
                      <button
                        onClick={() => descargarDocumento('carnet')}
                        className="w-full flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle className="text-green-500" size={16} />
                          <span className="text-sm font-medium">Carnet disponible</span>
                        </div>
                        <Download className="text-green-600" size={16} />
                      </button>
                    )}
                  </div>
                )}

                <p className="text-xs text-gray-400 mt-4">
                  Puedes cerrar esta página. Te enviaremos un correo cuando los documentos estén listos.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center mb-4">
                  <CheckCircle className="mx-auto text-arl-green mb-2" size={32} />
                  <p className="text-green-700 font-medium">¡Documentos Listos!</p>
                </div>

                <button
                  onClick={() => descargarDocumento('certificado')}
                  className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-arl-blue p-2 rounded-lg">
                      <FileText className="text-white" size={20} />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Certificado de Afiliación</p>
                      <p className="text-xs text-gray-500">Documento oficial</p>
                    </div>
                  </div>
                  <Download className="text-arl-blue" size={20} />
                </button>

                <button
                  onClick={() => descargarDocumento('carnet')}
                  className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-arl-green p-2 rounded-lg">
                      <CreditCard className="text-white" size={20} />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Carnet de Afiliación</p>
                      <p className="text-xs text-gray-500">Carnet digital</p>
                    </div>
                  </div>
                  <Download className="text-arl-blue" size={20} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Link de Validación */}
        <div className="card mt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-lg mb-1">Valida tu Afiliación</h3>
              <p className="text-gray-600 text-sm">
                Verifica la autenticidad de tu certificado en el sitio oficial
              </p>
            </div>
            <a
              href="https://www.sura.co/arl/afiliacion/verificacion"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex items-center gap-2 whitespace-nowrap"
            >
              <ExternalLink size={18} />
              Verificar Afiliación
            </a>
          </div>
        </div>

        {/* Información Adicional */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-6">
          <h3 className="font-bold text-arl-blue mb-3">Información Importante</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>• Tu cobertura inicia a partir del día siguiente hábil a la fecha de pago.</li>
            <li>• Recibirás una copia de los documentos en tu correo electrónico ({formData.email}).</li>
            <li>• En caso de accidente laboral, comunícate inmediatamente con la línea de atención ARL.</li>
            <li>• Para renovar tu afiliación, ingresa nuevamente a nuestra plataforma antes de la fecha de vencimiento.</li>
          </ul>
        </div>

        {/* Botón Inicio */}
        <div className="text-center mt-8">
          <Link to="/" className="btn-secondary">
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Confirmacion
