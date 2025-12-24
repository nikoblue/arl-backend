import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StepIndicator from '../components/StepIndicator'
import { Shield, Clock, CheckCircle, AlertCircle } from 'lucide-react'

function SeleccionPlan({ formData, updateFormData }) {
  const navigate = useNavigate()
  const [errors, setErrors] = useState({})
  const steps = ['Datos Personales', 'Selección de Plan', 'Pago', 'Confirmación']

  const nivelesRiesgo = [
    {
      nivel: 'I',
      nombre: 'Riesgo Mínimo',
      descripcion: 'Actividades administrativas, oficinas, comercio, educación',
      precioMes: 20000,
      color: 'border-green-500',
      bgColor: 'bg-green-50',
      badgeColor: 'bg-green-500'
    },
    {
      nivel: 'II',
      nombre: 'Riesgo Bajo',
      descripcion: 'Restaurantes, hoteles, call centers, peluquerías',
      precioMes: 28000,
      color: 'border-lime-500',
      bgColor: 'bg-lime-50',
      badgeColor: 'bg-lime-500'
    },
    {
      nivel: 'III',
      nombre: 'Riesgo Medio',
      descripcion: 'Manufactura liviana, hospitales, laboratorios',
      precioMes: 36000,
      color: 'border-yellow-500',
      bgColor: 'bg-yellow-50',
      badgeColor: 'bg-yellow-500'
    },
    {
      nivel: 'IV',
      nombre: 'Riesgo Alto',
      descripcion: 'Vigilancia, transporte, manufactura pesada',
      precioMes: 44000,
      color: 'border-orange-500',
      bgColor: 'bg-orange-50',
      badgeColor: 'bg-orange-500'
    },
    {
      nivel: 'V',
      nombre: 'Riesgo Máximo',
      descripcion: 'Construcción, minería, trabajo en alturas',
      precioMes: 52000,
      color: 'border-red-500',
      bgColor: 'bg-red-50',
      badgeColor: 'bg-red-500'
    }
  ]

  const tiemposCobertura = [
    { valor: '1', nombre: '1 Mes', multiplicador: 1 },
    { valor: '3', nombre: '3 Meses', multiplicador: 3, descuento: 5 },
    { valor: '6', nombre: '6 Meses', multiplicador: 6, descuento: 10 },
    { valor: '12', nombre: '12 Meses', multiplicador: 12, descuento: 15 }
  ]

  const calcularPrecio = () => {
    if (!formData.nivelRiesgo || !formData.tiempoCobertura) return 0
    
    const nivel = nivelesRiesgo.find(n => n.nivel === formData.nivelRiesgo)
    const tiempo = tiemposCobertura.find(t => t.valor === formData.tiempoCobertura)
    
    if (!nivel || !tiempo) return 0
    
    let precioTotal = nivel.precioMes * tiempo.multiplicador
    
    if (tiempo.descuento) {
      precioTotal = precioTotal * (1 - tiempo.descuento / 100)
    }
    
    return Math.round(precioTotal)
  }

  const handleSelectNivel = (nivel) => {
    updateFormData({ nivelRiesgo: nivel })
    if (errors.nivelRiesgo) {
      setErrors(prev => ({ ...prev, nivelRiesgo: '' }))
    }
  }

  const handleSelectTiempo = (tiempo) => {
    updateFormData({ tiempoCobertura: tiempo })
    if (errors.tiempoCobertura) {
      setErrors(prev => ({ ...prev, tiempoCobertura: '' }))
    }
  }

  const validateAndContinue = () => {
    const newErrors = {}
    
    if (!formData.nivelRiesgo) newErrors.nivelRiesgo = 'Debes seleccionar un nivel de riesgo'
    if (!formData.tiempoCobertura) newErrors.tiempoCobertura = 'Debes seleccionar un tiempo de cobertura'
    
    setErrors(newErrors)
    
    if (Object.keys(newErrors).length === 0) {
      updateFormData({ precioTotal: calcularPrecio() })
      navigate('/pago')
    }
  }

  const precioCalculado = calcularPrecio()

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <StepIndicator steps={steps} currentStep={1} />
        
        <div className="card mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-arl-blue p-3 rounded-lg">
              <Shield className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Selección de Plan</h2>
              <p className="text-gray-500">Elige el nivel de riesgo y tiempo de cobertura</p>
            </div>
          </div>

          {/* Nivel de Riesgo */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Shield size={20} className="text-arl-blue" />
              Nivel de Riesgo
            </h3>
            {errors.nivelRiesgo && (
              <p className="text-red-500 text-sm mb-3 flex items-center gap-1">
                <AlertCircle size={14} /> {errors.nivelRiesgo}
              </p>
            )}
            <div className="grid md:grid-cols-5 gap-3">
              {nivelesRiesgo.map((nivel) => (
                <div
                  key={nivel.nivel}
                  onClick={() => handleSelectNivel(nivel.nivel)}
                  className={`cursor-pointer rounded-xl p-4 border-2 transition-all ${
                    formData.nivelRiesgo === nivel.nivel
                      ? `${nivel.color} ${nivel.bgColor} shadow-lg`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`${nivel.badgeColor} text-white text-lg font-bold w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2`}>
                    {nivel.nivel}
                  </div>
                  <h4 className="font-semibold text-center text-sm mb-1">{nivel.nombre}</h4>
                  <p className="text-xs text-gray-500 text-center">{nivel.descripcion}</p>
                  <p className="text-sm text-arl-blue font-bold text-center mt-2">
                    ${nivel.precioMes.toLocaleString('es-CO')}/mes
                  </p>
                  {formData.nivelRiesgo === nivel.nivel && (
                    <div className="flex justify-center mt-2">
                      <CheckCircle className="text-arl-green" size={20} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tiempo de Cobertura */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock size={20} className="text-arl-blue" />
              Tiempo de Cobertura
            </h3>
            {errors.tiempoCobertura && (
              <p className="text-red-500 text-sm mb-3 flex items-center gap-1">
                <AlertCircle size={14} /> {errors.tiempoCobertura}
              </p>
            )}
            <div className="grid md:grid-cols-4 gap-4">
              {tiemposCobertura.map((tiempo) => (
                <div
                  key={tiempo.valor}
                  onClick={() => handleSelectTiempo(tiempo.valor)}
                  className={`cursor-pointer rounded-xl p-4 border-2 transition-all text-center ${
                    formData.tiempoCobertura === tiempo.valor
                      ? 'border-arl-blue bg-blue-50 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h4 className="font-bold text-xl mb-1">{tiempo.nombre}</h4>
                  {tiempo.descuento && (
                    <span className="inline-block bg-arl-green text-white text-xs px-2 py-1 rounded-full">
                      {tiempo.descuento}% descuento
                    </span>
                  )}
                  {formData.tiempoCobertura === tiempo.valor && (
                    <div className="flex justify-center mt-2">
                      <CheckCircle className="text-arl-green" size={20} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Resumen de Precio */}
          {precioCalculado > 0 && (
            <div className="bg-gradient-to-r from-arl-blue to-blue-700 text-white rounded-xl p-6 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-blue-200 text-sm">Total a pagar</p>
                  <p className="text-3xl font-bold">
                    ${precioCalculado.toLocaleString('es-CO')} COP
                  </p>
                  <p className="text-blue-200 text-sm mt-1">
                    Nivel {formData.nivelRiesgo} - {formData.tiempoCobertura} {formData.tiempoCobertura === '1' ? 'mes' : 'meses'} de cobertura
                  </p>
                </div>
                <Shield size={48} className="text-white/30" />
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-between pt-4">
            <button 
              onClick={() => navigate('/registro')} 
              className="btn-secondary"
            >
              ← Volver
            </button>
            <button 
              onClick={validateAndContinue} 
              className="btn-primary"
            >
              Continuar al Pago →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SeleccionPlan
