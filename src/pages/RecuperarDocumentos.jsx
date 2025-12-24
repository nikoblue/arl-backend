import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, FileText, CreditCard, Download, AlertCircle, CheckCircle, Loader, ArrowLeft } from 'lucide-react'
import { API_URL, UPLOADS_URL } from '../config'

function RecuperarDocumentos() {
  const [codigo, setCodigo] = useState('')
  const [buscando, setBuscando] = useState(false)
  const [error, setError] = useState('')
  const [afiliacion, setAfiliacion] = useState(null)

  const buscarDocumentos = async (e) => {
    e.preventDefault()
    setError('')
    setAfiliacion(null)

    if (!codigo.trim()) {
      setError('Por favor ingresa tu código de pago')
      return
    }

    setBuscando(true)

    try {
      const res = await fetch(`${API_URL}/afiliaciones/verificar/${codigo.trim().toUpperCase()}`)
      const data = await res.json()

      if (!data.success) {
        setError('No se encontró ninguna afiliación con ese código. Verifica que esté correcto.')
        setBuscando(false)
        return
      }

      if (!data.pagado) {
        setError('Esta afiliación aún no ha sido pagada. Contacta al asesor para completar el pago.')
        setBuscando(false)
        return
      }

      setAfiliacion(data)
    } catch (err) {
      setError('Error de conexión. Intenta nuevamente.')
    }

    setBuscando(false)
  }

  const descargarDocumento = (tipo) => {
    const url = tipo === 'certificado' ? afiliacion.certificadoUrl : afiliacion.carnetUrl
    if (url) {
      window.open(`${UPLOADS_URL}${url}`, '_blank')
    }
  }

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-arl-blue w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Recuperar Documentos</h1>
          <p className="text-gray-600">
            Ingresa tu código de pago para descargar tu certificado y carnet de afiliación
          </p>
        </div>

        {/* Formulario de búsqueda */}
        <div className="card mb-6">
          <form onSubmit={buscarDocumentos} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código de Pago
              </label>
              <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                placeholder="Ej: PAG-20241224-1234"
                className="input-field text-center text-lg font-mono tracking-wider"
              />
              <p className="text-xs text-gray-500 mt-1">
                Este código te fue proporcionado cuando realizaste el pago
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={buscando}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              {buscando ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Buscando...
                </>
              ) : (
                <>
                  <Search size={20} />
                  Buscar Documentos
                </>
              )}
            </button>
          </form>
        </div>

        {/* Resultados */}
        {afiliacion && (
          <div className="card">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 mb-6">
              <CheckCircle className="text-green-500" size={24} />
              <div>
                <p className="font-medium text-green-700">¡Afiliación encontrada!</p>
                <p className="text-sm text-green-600">
                  Pago confirmado el {new Date(afiliacion.fechaPago).toLocaleDateString('es-CO')}
                </p>
              </div>
            </div>

            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <FileText className="text-arl-blue" size={20} />
              Tus Documentos
            </h3>

            <div className="space-y-3">
              {afiliacion.certificadoUrl ? (
                <button
                  onClick={() => descargarDocumento('certificado')}
                  className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
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
              ) : (
                <div className="p-4 bg-gray-100 rounded-lg text-center text-gray-500">
                  <p className="text-sm">Certificado aún no disponible</p>
                </div>
              )}

              {afiliacion.carnetUrl ? (
                <button
                  onClick={() => descargarDocumento('carnet')}
                  className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors"
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
                  <Download className="text-arl-green" size={20} />
                </button>
              ) : (
                <div className="p-4 bg-gray-100 rounded-lg text-center text-gray-500">
                  <p className="text-sm">Carnet aún no disponible</p>
                </div>
              )}
            </div>

            {(!afiliacion.certificadoUrl || !afiliacion.carnetUrl) && (
              <p className="text-xs text-gray-500 mt-4 text-center">
                Si los documentos no están disponibles, contacta al asesor para que los suba.
              </p>
            )}
          </div>
        )}

        {/* Link de regreso */}
        <div className="text-center mt-8">
          <Link to="/" className="inline-flex items-center gap-2 text-arl-blue hover:underline">
            <ArrowLeft size={18} />
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  )
}

export default RecuperarDocumentos
