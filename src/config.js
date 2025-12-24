// Configuración de la aplicación
// Cambiar estas URLs cuando se despliegue a producción

const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'

export const API_URL = isDevelopment 
  ? 'http://localhost:3001/api'
  : 'https://TU-BACKEND.railway.app/api'  // Cambiar por tu URL de Railway/Render

export const UPLOADS_URL = isDevelopment
  ? 'http://localhost:3001'
  : 'https://TU-BACKEND.railway.app'  // Cambiar por tu URL de Railway/Render
