import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import StepIndicator from '../components/StepIndicator'
import { MessageCircle, Shield, Copy, CheckCircle, AlertCircle, Clock, Loader } from 'lucide-react'
import { API_URL } from '../config'

function Pago({ formData, updateFormData }) {
  const navigate = useNavigate()
  const [codigoPago, setCodigoPago] = useState(formData.codigoPago || '')
  const [codigoIngresado, setCodigoIngresado] = useState('')
  const [copiado, setCopiado] = useState(false)
  const [verificando, setVerificando] = useState(false)
  const [registrando, setRegistrando] = useState(false)
  const [error, setError] = useState('')
  const steps = ['Datos Personales', 'Selección de Plan', 'Pago', 'Confirmación']
  const inicializado = useRef(false)

  const WHATSAPP_NUMBER = '573227332185' // Cambiar por el número real de WhatsApp de la empresa

  useEffect(() => {
    // Evitar doble ejecución en React 18 StrictMode
    if (inicializado.current) return
    inicializado.current = true

    // Si ya tiene código, no crear otro
    if (formData.codigoPago) {
      setCodigoPago(formData.codigoPago)
      return
    }

    // Generar código de pago único y registrar en la base de datos
    const inicializarPago = async () => {
      const fecha = new Date()
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
      const nuevoCodigo = `PAG-${fecha.getFullYear()}${(fecha.getMonth() + 1).toString().padStart(2, '0')}${fecha.getDate().toString().padStart(2, '0')}-${random}`
      
      setCodigoPago(nuevoCodigo)
      updateFormData({ codigoPago: nuevoCodigo })
      setRegistrando(true)

      // Registrar afiliación en la base de datos
      try {
        const res = await fetch(`${API_URL}/afiliaciones`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            codigoPago: nuevoCodigo,
            nombres: formData.nombres,
            apellidos: formData.apellidos,
            tipoDocumento: formData.tipoDocumento,
            numeroDocumento: formData.numeroDocumento,
            email: formData.email,
            telefono: formData.telefono,
            direccion: formData.direccion,
            ciudad: formData.ciudad,
            departamento: formData.departamento,
            nivelRiesgo: formData.nivelRiesgo,
            tiempoCobertura: formData.tiempoCobertura,
            precioTotal: formData.precioTotal
          })
        })
        const data = await res.json()
        if (!data.success) {
          console.error('Error registrando afiliación:', data.error)
        }
      } catch (error) {
        console.error('Error de conexión:', error)
      }
      setRegistrando(false)
    }

    inicializarPago()
  }, [])

  const copiarCodigo = () => {
    navigator.clipboard.writeText(codigoPago)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  const abrirWhatsApp = () => {
    const mensaje = encodeURIComponent(
      `¡Hola! Quiero realizar el pago de mi afiliación ARL.\n\n` +
      `📋 *Código de Pago:* ${codigoPago}\n` +
      `👤 *Nombre:* ${formData.nombres} ${formData.apellidos}\n` +
      `🪪 *Documento:* ${formData.tipoDocumento} ${formData.numeroDocumento}\n` +
      `⚠️ *Nivel de Riesgo:* ${formData.nivelRiesgo}\n` +
      `📅 *Cobertura:* ${formData.tiempoCobertura} ${formData.tiempoCobertura === '1' ? 'mes' : 'meses'}\n` +
      `💰 *Total a Pagar:* $${formData.precioTotal?.toLocaleString('es-CO')} COP\n\n` +
      `¿Cuáles son los medios de pago disponibles?`
    )
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${mensaje}`, '_blank')
  }

  const verificarPago = async () => {
    setError('')
    
    if (!codigoIngresado.trim()) {
      setError('Por favor ingresa el código de pago')
      return
    }

    if (codigoIngresado.trim().toUpperCase() !== codigoPago.toUpperCase()) {
      setError('El código ingresado no coincide con tu código de pago')
      return
    }

    setVerificando(true)

    try {
      // Verificar en la base de datos si el asesor confirmó el pago
      const res = await fetch(`${API_URL}/afiliaciones/verificar/${codigoPago}`)
      const data = await res.json()

      if (!data.success) {
        setError('No se encontró la afiliación. Contacta al asesor.')
        setVerificando(false)
        return
      }

      if (data.pagado) {
        // El asesor confirmó el pago, actualizar estado y navegar
        updateFormData({ 
          pagado: true, 
          fechaPago: data.fechaPago,
          certificadoUrl: data.certificadoUrl,
          carnetUrl: data.carnetUrl
        })
        navigate('/confirmacion')
      } else {
        setError('El pago aún no ha sido confirmado por el asesor. Por favor espera la confirmación por WhatsApp.')
      }
    } catch (error) {
      setError('Error de conexión. Intenta nuevamente.')
    }
    
    setVerificando(false)
  }

  const nivelesInfo = {
    'I': 'Riesgo Mínimo',
    'II': 'Riesgo Bajo',
    'III': 'Riesgo Medio',
    'IV': 'Riesgo Alto',
    'V': 'Riesgo Máximo'
  }

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <StepIndicator steps={steps} currentStep={2} />
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Proceso de Pago */}
          <div className="md:col-span-2 space-y-6">
            {/* Paso 1: Código de Pago */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-arl-blue text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">1</div>
                <h2 className="text-xl font-bold text-gray-800">Tu Código de Pago</h2>
              </div>
              
              <div className="bg-gradient-to-r from-arl-blue to-blue-700 text-white rounded-xl p-6 text-center">
                <p className="text-blue-200 text-sm mb-2">Código único de pago</p>
                <div className="flex items-center justify-center gap-3">
                  <p className="text-3xl font-bold tracking-wider">{codigoPago}</p>
                  <button
                    onClick={copiarCodigo}
                    className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
                    title="Copiar código"
                  >
                    {copiado ? <CheckCircle size={20} /> : <Copy size={20} />}
                  </button>
                </div>
                {copiado && <p className="text-green-300 text-sm mt-2">¡Código copiado!</p>}
              </div>
              
              <p className="text-gray-500 text-sm mt-4 text-center">
                Guarda este código, lo necesitarás para confirmar tu pago.
              </p>
            </div>

            {/* Paso 2: Contactar Asesor */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-arl-green text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">2</div>
                <h2 className="text-xl font-bold text-gray-800">Contacta a un Asesor</h2>
              </div>
              
              <p className="text-gray-600 mb-4">
                Haz clic en el botón de WhatsApp para contactar a un asesor. Él te indicará los medios de pago disponibles y confirmará tu pago.
              </p>

              <button
                onClick={abrirWhatsApp}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                <MessageCircle size={28} />
                <span className="text-lg">Abrir WhatsApp con Asesor</span>
              </button>

              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Clock className="text-yellow-600 mt-0.5" size={18} />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-800">Horario de Atención</p>
                    <p className="text-yellow-700">Lun-Vie: 6:00 AM - 6:00 PM | Sáb: 7:00 AM - 1:00 PM</p>
                    <p className="text-yellow-600 text-xs mt-1">* Pagos fuera de horario serán procesados el siguiente día hábil a primera hora.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Paso 3: Confirmar Pago */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-arl-orange text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">3</div>
                <h2 className="text-xl font-bold text-gray-800">Confirma tu Pago</h2>
              </div>
              
              <p className="text-gray-600 mb-4">
                Una vez el asesor confirme tu pago, ingresa tu código de pago aquí para continuar:
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ingresa tu código de pago
                  </label>
                  <input
                    type="text"
                    value={codigoIngresado}
                    onChange={(e) => {
                      setCodigoIngresado(e.target.value.toUpperCase())
                      setError('')
                    }}
                    placeholder="PAG-XXXXXXXX-XXXX"
                    className={`input-field text-center text-lg font-mono ${error ? 'border-red-500' : ''}`}
                  />
                  {error && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle size={14} /> {error}
                    </p>
                  )}
                </div>

                <button
                  onClick={verificarPago}
                  disabled={verificando}
                  className={`w-full btn-success flex items-center justify-center gap-2 ${
                    verificando ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {verificando ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Verificando pago...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      Confirmar Pago
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Resumen del Pedido */}
          <div className="md:col-span-1">
            <div className="card sticky top-4">
              <h3 className="font-bold text-lg mb-4">Resumen del Pedido</h3>
              
              <div className="space-y-3 text-sm border-b pb-4 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Afiliado:</span>
                  <span className="font-medium text-right">{formData.nombres} {formData.apellidos}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Documento:</span>
                  <span className="font-medium">{formData.tipoDocumento} {formData.numeroDocumento}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Nivel de Riesgo:</span>
                  <span className="font-medium">{nivelesInfo[formData.nivelRiesgo]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Cobertura:</span>
                  <span className="font-medium">{formData.tiempoCobertura} {formData.tiempoCobertura === '1' ? 'mes' : 'meses'}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-lg">Total:</span>
                <span className="font-bold text-2xl text-arl-blue">
                  ${formData.precioTotal?.toLocaleString('es-CO')} COP
                </span>
              </div>

              <button 
                onClick={() => navigate('/seleccion-plan')} 
                className="w-full btn-secondary"
              >
                ← Volver
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                <Shield size={14} />
                <span>Proceso 100% seguro</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Pago
