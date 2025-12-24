// Configuración de la aplicación
// Backend alojado en Railway

// Detectamos si estamos en localhost (PC) o en la web
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'

// URL de la API (Base de Datos)
export const API_URL = isDevelopment 
  ? 'http://localhost:3001/api' 
  : 'https://arl-backend-production.up.railway.app/api'

// URL para cargar imágenes/PDFs
export const UPLOADS_URL = isDevelopment
  ? 'http://localhost:3001'
  : 'https://arl-backend-production.up.railway.app'