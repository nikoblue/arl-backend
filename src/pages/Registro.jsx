import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StepIndicator from '../components/StepIndicator'
import { User, AlertCircle } from 'lucide-react'

function Registro({ formData, updateFormData }) {
  const navigate = useNavigate()
  const [errors, setErrors] = useState({})
  const steps = ['Datos Personales', 'Selección de Plan', 'Pago', 'Confirmación']

  const departamentos = [
    'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bolívar', 'Boyacá', 'Caldas',
    'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó', 'Córdoba', 'Cundinamarca',
    'Guainía', 'Guaviare', 'Huila', 'La Guajira', 'Magdalena', 'Meta', 'Nariño',
    'Norte de Santander', 'Putumayo', 'Quindío', 'Risaralda', 'San Andrés', 'Santander',
    'Sucre', 'Tolima', 'Valle del Cauca', 'Vaupés', 'Vichada'
  ]

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.numeroDocumento) newErrors.numeroDocumento = 'El número de documento es requerido'
    if (!formData.nombres) newErrors.nombres = 'Los nombres son requeridos'
    if (!formData.apellidos) newErrors.apellidos = 'Los apellidos son requeridos'
    if (!formData.fechaNacimiento) newErrors.fechaNacimiento = 'La fecha de nacimiento es requerida'
    if (!formData.genero) newErrors.genero = 'El género es requerido'
    if (!formData.email) {
      newErrors.email = 'El email es requerido'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido'
    }
    if (!formData.telefono) newErrors.telefono = 'El teléfono es requerido'
    if (!formData.direccion) newErrors.direccion = 'La dirección es requerida'
    if (!formData.ciudad) newErrors.ciudad = 'La ciudad es requerida'
    if (!formData.departamento) newErrors.departamento = 'El departamento es requerido'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      navigate('/seleccion-plan')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    updateFormData({ [name]: value })
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4">
        <StepIndicator steps={steps} currentStep={0} />
        
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-arl-blue p-3 rounded-lg">
              <User className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Datos Personales</h2>
              <p className="text-gray-500">Completa tu información para la afiliación</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Documento */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Documento
                </label>
                <select
                  name="tipoDocumento"
                  value={formData.tipoDocumento}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="CC">Cédula de Ciudadanía</option>
                  <option value="CE">Cédula de Extranjería</option>
                  <option value="PA">Pasaporte</option>
                  <option value="TI">Tarjeta de Identidad</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Documento *
                </label>
                <input
                  type="text"
                  name="numeroDocumento"
                  value={formData.numeroDocumento}
                  onChange={handleChange}
                  className={`input-field ${errors.numeroDocumento ? 'border-red-500' : ''}`}
                  placeholder="Ej: 1234567890"
                />
                {errors.numeroDocumento && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.numeroDocumento}
                  </p>
                )}
              </div>
            </div>

            {/* Nombres y Apellidos */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombres *
                </label>
                <input
                  type="text"
                  name="nombres"
                  value={formData.nombres}
                  onChange={handleChange}
                  className={`input-field ${errors.nombres ? 'border-red-500' : ''}`}
                  placeholder="Ej: Juan Carlos"
                />
                {errors.nombres && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.nombres}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apellidos *
                </label>
                <input
                  type="text"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                  className={`input-field ${errors.apellidos ? 'border-red-500' : ''}`}
                  placeholder="Ej: Pérez García"
                />
                {errors.apellidos && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.apellidos}
                  </p>
                )}
              </div>
            </div>

            {/* Fecha de Nacimiento y Género */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Nacimiento *
                </label>
                <input
                  type="date"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  className={`input-field ${errors.fechaNacimiento ? 'border-red-500' : ''}`}
                />
                {errors.fechaNacimiento && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.fechaNacimiento}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Género *
                </label>
                <select
                  name="genero"
                  value={formData.genero}
                  onChange={handleChange}
                  className={`input-field ${errors.genero ? 'border-red-500' : ''}`}
                >
                  <option value="">Seleccionar...</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                  <option value="O">Otro</option>
                </select>
                {errors.genero && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.genero}
                  </p>
                )}
              </div>
            </div>

            {/* Email y Teléfono */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="Ej: correo@ejemplo.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.email}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className={`input-field ${errors.telefono ? 'border-red-500' : ''}`}
                  placeholder="Ej: 3001234567"
                />
                {errors.telefono && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.telefono}
                  </p>
                )}
              </div>
            </div>

            {/* Dirección */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección de Residencia *
              </label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                className={`input-field ${errors.direccion ? 'border-red-500' : ''}`}
                placeholder="Ej: Calle 123 # 45-67, Apto 101"
              />
              {errors.direccion && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.direccion}
                </p>
              )}
            </div>

            {/* Ciudad y Departamento */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ciudad *
                </label>
                <input
                  type="text"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleChange}
                  className={`input-field ${errors.ciudad ? 'border-red-500' : ''}`}
                  placeholder="Ej: Bogotá"
                />
                {errors.ciudad && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.ciudad}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Departamento *
                </label>
                <select
                  name="departamento"
                  value={formData.departamento}
                  onChange={handleChange}
                  className={`input-field ${errors.departamento ? 'border-red-500' : ''}`}
                >
                  <option value="">Seleccionar...</option>
                  {departamentos.map(dep => (
                    <option key={dep} value={dep}>{dep}</option>
                  ))}
                </select>
                {errors.departamento && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.departamento}
                  </p>
                )}
              </div>
            </div>

            {/* Botón Submit */}
            <div className="flex justify-end pt-4">
              <button type="submit" className="btn-primary">
                Continuar a Selección de Plan →
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Registro
