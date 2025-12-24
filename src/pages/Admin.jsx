import { useState, useEffect } from 'react'
import { 
  Shield, LogOut, Users, DollarSign, Clock, CheckCircle, XCircle, 
  Upload, Eye, Download, RefreshCw, Search, FileText, CreditCard,
  AlertCircle, ChevronDown, ChevronUp
} from 'lucide-react'
import { API_URL, UPLOADS_URL } from '../config'

function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginData, setLoginData] = useState({ username: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [user, setUser] = useState(null)
  const [afiliaciones, setAfiliaciones] = useState([])
  const [estadisticas, setEstadisticas] = useState(null)
  const [loading, setLoading] = useState(false)
  const [filtro, setFiltro] = useState('todos')
  const [busqueda, setBusqueda] = useState('')
  const [selectedAfiliacion, setSelectedAfiliacion] = useState(null)
  const [uploadingDoc, setUploadingDoc] = useState({ tipo: '', loading: false })

  // Login
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    
    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      })
      const data = await res.json()
      
      if (data.success) {
        setIsLoggedIn(true)
        setUser(data.user)
        localStorage.setItem('adminUser', JSON.stringify(data.user))
        loadData()
      } else {
        setLoginError('Usuario o contraseña incorrectos')
      }
    } catch (error) {
      setLoginError('Error de conexión con el servidor')
    }
  }

  // Logout
  const handleLogout = () => {
    setIsLoggedIn(false)
    setUser(null)
    localStorage.removeItem('adminUser')
  }

  // Cargar datos
  const loadData = async () => {
    setLoading(true)
    try {
      const [afilRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/admin/afiliaciones`),
        fetch(`${API_URL}/admin/estadisticas`)
      ])
      
      const afilData = await afilRes.json()
      const statsData = await statsRes.json()
      
      if (afilData.success) setAfiliaciones(afilData.afiliaciones)
      if (statsData.success) setEstadisticas(statsData.estadisticas)
    } catch (error) {
      console.error('Error cargando datos:', error)
    }
    setLoading(false)
  }

  // Confirmar pago
  const confirmarPago = async (codigo) => {
    if (!confirm('¿Confirmar que el pago ha sido recibido?')) return
    
    try {
      const res = await fetch(`${API_URL}/admin/afiliaciones/${codigo}/confirmar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notas: 'Pago confirmado por asesor' })
      })
      const data = await res.json()
      
      if (data.success) {
        alert('✅ Pago confirmado exitosamente')
        loadData()
        if (selectedAfiliacion?.codigo_pago === codigo) {
          setSelectedAfiliacion(prev => ({ ...prev, estado: 'pagado' }))
        }
      }
    } catch (error) {
      alert('Error al confirmar pago')
    }
  }

  // Rechazar afiliación
  const rechazarAfiliacion = async (codigo) => {
    const notas = prompt('Motivo del rechazo (opcional):')
    if (notas === null) return
    
    try {
      const res = await fetch(`${API_URL}/admin/afiliaciones/${codigo}/rechazar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notas })
      })
      const data = await res.json()
      
      if (data.success) {
        alert('Afiliación rechazada')
        loadData()
      }
    } catch (error) {
      alert('Error al rechazar')
    }
  }

  // Subir documento
  const subirDocumento = async (codigo, tipo, file) => {
    setUploadingDoc({ tipo, loading: true })
    
    const formData = new FormData()
    formData.append('documento', file)
    formData.append('tipo', tipo)
    formData.append('codigoPago', codigo)
    
    try {
      const res = await fetch(`${API_URL}/admin/afiliaciones/${codigo}/documentos`, {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      
      if (data.success) {
        alert(`✅ ${tipo === 'certificado' ? 'Certificado' : 'Carnet'} subido correctamente`)
        loadData()
        // Actualizar selectedAfiliacion
        if (selectedAfiliacion?.codigo_pago === codigo) {
          const key = tipo === 'certificado' ? 'certificado_url' : 'carnet_url'
          setSelectedAfiliacion(prev => ({ ...prev, [key]: data.url }))
        }
      }
    } catch (error) {
      alert('Error al subir documento')
    }
    setUploadingDoc({ tipo: '', loading: false })
  }

  // Verificar sesión guardada
  useEffect(() => {
    const savedUser = localStorage.getItem('adminUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setIsLoggedIn(true)
      loadData()
    }
  }, [])

  // Filtrar afiliaciones
  const afiliacionesFiltradas = afiliaciones.filter(a => {
    const matchFiltro = filtro === 'todos' || a.estado === filtro
    const matchBusqueda = !busqueda || 
      a.codigo_pago.toLowerCase().includes(busqueda.toLowerCase()) ||
      a.nombres.toLowerCase().includes(busqueda.toLowerCase()) ||
      a.apellidos.toLowerCase().includes(busqueda.toLowerCase()) ||
      a.numero_documento.includes(busqueda)
    return matchFiltro && matchBusqueda
  })

  // Si no está logueado, mostrar login
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="bg-arl-blue w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="text-white" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Panel de Administración</h1>
            <p className="text-gray-500">ARL Riesgos Profesionales</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
              <input
                type="text"
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                className="input-field"
                placeholder="Ingresa tu usuario"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="input-field"
                placeholder="Ingresa tu contraseña"
                required
              />
            </div>
            
            {loginError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle size={16} />
                {loginError}
              </div>
            )}
            
            <button type="submit" className="w-full btn-primary">
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-arl-blue p-2 rounded-lg">
              <Shield className="text-white" size={24} />
            </div>
            <div>
              <h1 className="font-bold text-gray-800">Panel de Administración</h1>
              <p className="text-sm text-gray-500">Bienvenido, {user?.nombre}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={loadData} className="btn-secondary flex items-center gap-2" disabled={loading}>
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Actualizar
            </button>
            <button onClick={handleLogout} className="btn-secondary flex items-center gap-2 text-red-600">
              <LogOut size={16} />
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Estadísticas */}
        {estadisticas && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Users className="text-blue-600" size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{estadisticas.total}</p>
                  <p className="text-xs text-gray-500">Total</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <Clock className="text-yellow-600" size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{estadisticas.pendientes}</p>
                  <p className="text-xs text-gray-500">Pendientes</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckCircle className="text-green-600" size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{estadisticas.pagados}</p>
                  <p className="text-xs text-gray-500">Pagados</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <XCircle className="text-red-600" size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{estadisticas.rechazados}</p>
                  <p className="text-xs text-gray-500">Rechazados</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <DollarSign className="text-purple-600" size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold">${(estadisticas.ingresoTotal || 0).toLocaleString('es-CO')}</p>
                  <p className="text-xs text-gray-500">Ingresos</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar por código, nombre o documento..."
                  className="input-field pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {['todos', 'pendiente', 'pagado', 'rechazado'].map(f => (
                <button
                  key={f}
                  onClick={() => setFiltro(f)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filtro === f 
                      ? 'bg-arl-blue text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Lista de Afiliaciones */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Afiliado</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Documento</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Riesgo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Docs</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {afiliacionesFiltradas.map(afil => (
                  <tr key={afil.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm font-medium text-arl-blue">{afil.codigo_pago}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{afil.nombres} {afil.apellidos}</p>
                      <p className="text-xs text-gray-500">{afil.email}</p>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {afil.tipo_documento} {afil.numero_documento}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                        Nivel {afil.nivel_riesgo}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      ${afil.precio_total?.toLocaleString('es-CO')}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        afil.estado === 'pagado' ? 'bg-green-100 text-green-800' :
                        afil.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {afil.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {afil.certificado_url && <FileText className="text-green-500" size={16} title="Certificado" />}
                        {afil.carnet_url && <CreditCard className="text-green-500" size={16} title="Carnet" />}
                        {!afil.certificado_url && !afil.carnet_url && <span className="text-gray-400 text-xs">-</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedAfiliacion(selectedAfiliacion?.id === afil.id ? null : afil)}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Ver detalles"
                        >
                          {selectedAfiliacion?.id === afil.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                        {afil.estado === 'pendiente' && (
                          <>
                            <button
                              onClick={() => confirmarPago(afil.codigo_pago)}
                              className="p-1 hover:bg-green-100 rounded text-green-600"
                              title="Confirmar pago"
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button
                              onClick={() => rechazarAfiliacion(afil.codigo_pago)}
                              className="p-1 hover:bg-red-100 rounded text-red-600"
                              title="Rechazar"
                            >
                              <XCircle size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {afiliacionesFiltradas.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Users size={48} className="mx-auto mb-4 opacity-50" />
                <p>No se encontraron afiliaciones</p>
              </div>
            )}
          </div>
        </div>

        {/* Panel de Detalles */}
        {selectedAfiliacion && (
          <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-lg mb-4">
              Detalles de Afiliación: {selectedAfiliacion.codigo_pago}
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Info del afiliado */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700 border-b pb-2">Información Personal</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-gray-500">Nombre:</span>
                  <span className="font-medium">{selectedAfiliacion.nombres} {selectedAfiliacion.apellidos}</span>
                  <span className="text-gray-500">Documento:</span>
                  <span>{selectedAfiliacion.tipo_documento} {selectedAfiliacion.numero_documento}</span>
                  <span className="text-gray-500">Email:</span>
                  <span>{selectedAfiliacion.email}</span>
                  <span className="text-gray-500">Teléfono:</span>
                  <span>{selectedAfiliacion.telefono || '-'}</span>
                  <span className="text-gray-500">Dirección:</span>
                  <span>{selectedAfiliacion.direccion || '-'}</span>
                  <span className="text-gray-500">Ciudad:</span>
                  <span>{selectedAfiliacion.ciudad}, {selectedAfiliacion.departamento}</span>
                </div>
                
                <h4 className="font-medium text-gray-700 border-b pb-2 mt-4">Plan Seleccionado</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-gray-500">Nivel de Riesgo:</span>
                  <span className="font-medium">Nivel {selectedAfiliacion.nivel_riesgo}</span>
                  <span className="text-gray-500">Cobertura:</span>
                  <span>{selectedAfiliacion.tiempo_cobertura} {selectedAfiliacion.tiempo_cobertura === '1' ? 'mes' : 'meses'}</span>
                  <span className="text-gray-500">Total a Pagar:</span>
                  <span className="font-bold text-arl-blue">${selectedAfiliacion.precio_total?.toLocaleString('es-CO')} COP</span>
                </div>
              </div>

              {/* Subir documentos */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700 border-b pb-2">Gestión de Documentos</h4>
                
                {/* Certificado */}
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Certificado de Afiliación</span>
                    {selectedAfiliacion.certificado_url && (
                      <a 
                        href={`http://localhost:3001${selectedAfiliacion.certificado_url}`}
                        target="_blank"
                        className="text-arl-blue hover:underline text-sm flex items-center gap-1"
                      >
                        <Eye size={14} /> Ver
                      </a>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          subirDocumento(selectedAfiliacion.codigo_pago, 'certificado', e.target.files[0])
                        }
                      }}
                      className="text-sm file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-arl-blue file:text-white file:cursor-pointer"
                      disabled={uploadingDoc.loading}
                    />
                  </div>
                  {selectedAfiliacion.certificado_url && (
                    <p className="text-green-600 text-xs mt-2 flex items-center gap-1">
                      <CheckCircle size={12} /> Documento subido
                    </p>
                  )}
                </div>

                {/* Carnet */}
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Carnet de Afiliación</span>
                    {selectedAfiliacion.carnet_url && (
                      <a 
                        href={`http://localhost:3001${selectedAfiliacion.carnet_url}`}
                        target="_blank"
                        className="text-arl-blue hover:underline text-sm flex items-center gap-1"
                      >
                        <Eye size={14} /> Ver
                      </a>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          subirDocumento(selectedAfiliacion.codigo_pago, 'carnet', e.target.files[0])
                        }
                      }}
                      className="text-sm file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-arl-blue file:text-white file:cursor-pointer"
                      disabled={uploadingDoc.loading}
                    />
                  </div>
                  {selectedAfiliacion.carnet_url && (
                    <p className="text-green-600 text-xs mt-2 flex items-center gap-1">
                      <CheckCircle size={12} /> Documento subido
                    </p>
                  )}
                </div>

                {selectedAfiliacion.estado === 'pendiente' && (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => confirmarPago(selectedAfiliacion.codigo_pago)}
                      className="flex-1 btn-success flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={18} />
                      Confirmar Pago
                    </button>
                    <button
                      onClick={() => rechazarAfiliacion(selectedAfiliacion.codigo_pago)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                    >
                      <XCircle size={18} />
                      Rechazar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Admin
