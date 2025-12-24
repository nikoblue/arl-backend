import express from 'express'
import cors from 'cors'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import pool from './db.js' // Importamos la conexión a la base de datos

// Configuración de rutas para ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Crear directorio para uploads (OJO: En Railway esto es temporal)
const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

// ==================== INICIALIZACIÓN DE TABLAS (SQL) ====================
// Esta función crea las tablas en PostgreSQL si no existen al iniciar
const initDB = async () => {
  try {
    // 1. Tabla de Usuarios (Admin)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        nombre VARCHAR(100)
      );
    `)

    // 2. Tabla de Afiliaciones
    await pool.query(`
      CREATE TABLE IF NOT EXISTS afiliaciones (
        id SERIAL PRIMARY KEY,
        codigo_pago VARCHAR(50) UNIQUE NOT NULL,
        nombres VARCHAR(100),
        apellidos VARCHAR(100),
        tipo_documento VARCHAR(20),
        numero_documento VARCHAR(50),
        email VARCHAR(100),
        telefono VARCHAR(20),
        direccion TEXT,
        ciudad VARCHAR(50),
        departamento VARCHAR(50),
        nivel_riesgo VARCHAR(10),
        tiempo_cobertura VARCHAR(50),
        precio_total NUMERIC,
        estado VARCHAR(20) DEFAULT 'pendiente',
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fecha_pago TIMESTAMP,
        certificado_url TEXT,
        carnet_url TEXT,
        notas_asesor TEXT
      );
    `)

    // 3. Crear usuario admin por defecto si no existe
    const adminCheck = await pool.query("SELECT * FROM users WHERE username = 'admin'")
    if (adminCheck.rows.length === 0) {
      await pool.query(
        "INSERT INTO users (username, password, nombre) VALUES ($1, $2, $3)",
        ['admin', 'admin123', 'Administrador']
      )
      console.log('👤 Usuario admin creado por defecto')
    }

    console.log('✅ Tablas de base de datos sincronizadas')
  } catch (error) {
    console.error('❌ Error inicializando DB:', error)
  }
}

// Ejecutamos la inicialización
initDB()

// ==================== CONFIGURACIÓN MULTER ====================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    // Usamos el código de pago si viene en el body, si no, un timestamp
    const codigoPago = req.body.codigoPago || Date.now()
    const tipo = req.body.tipo || 'doc'
    const ext = path.extname(file.originalname)
    cb(null, `${codigoPago}_${tipo}${ext}`)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png']
    const ext = path.extname(file.originalname).toLowerCase()
    if (allowedTypes.includes(ext)) cb(null, true)
    else cb(new Error('Tipo de archivo no permitido'))
  }
})

// Middleware
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(uploadsDir))

// ==================== RUTAS API (AHORA CON SQL) ====================

// 1. Registrar nueva afiliación
app.post('/api/afiliaciones', async (req, res) => {
  try {
    const {
      codigoPago, nombres, apellidos, tipoDocumento, numeroDocumento,
      email, telefono, direccion, ciudad, departamento,
      nivelRiesgo, tiempoCobertura, precioTotal
    } = req.body

    // Insertamos en PostgreSQL
    // $1, $2, etc son marcadores de seguridad para evitar Hackeos (SQL Injection)
    const query = `
      INSERT INTO afiliaciones (
        codigo_pago, nombres, apellidos, tipo_documento, numero_documento,
        email, telefono, direccion, ciudad, departamento,
        nivel_riesgo, tiempo_cobertura, precio_total, estado
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'pendiente')
      RETURNING *
    `
    const values = [
      codigoPago, nombres, apellidos, tipoDocumento, numeroDocumento,
      email, telefono, direccion, ciudad, departamento,
      nivelRiesgo, tiempoCobertura, precioTotal
    ]

    await pool.query(query, values)
    res.json({ success: true, message: 'Afiliación registrada', codigoPago })

  } catch (error) {
    // Si el error es por código duplicado (código 23505 en Postgres)
    if (error.code === '23505') {
      return res.json({ success: true, message: 'Afiliación ya existe', codigoPago: req.body.codigoPago })
    }
    console.error(error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// 2. Verificar estado de pago
app.get('/api/afiliaciones/verificar/:codigo', async (req, res) => {
  try {
    const { codigo } = req.params
    const result = await pool.query('SELECT * FROM afiliaciones WHERE codigo_pago = $1', [codigo])

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Código no encontrado' })
    }

    const afiliacion = result.rows[0]
    res.json({
      success: true,
      pagado: afiliacion.estado === 'pagado',
      estado: afiliacion.estado,
      certificadoUrl: afiliacion.certificado_url,
      carnetUrl: afiliacion.carnet_url,
      fechaPago: afiliacion.fecha_pago
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// ==================== RUTAS ADMIN ====================

// Login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body
    // Buscamos usuario en la DB
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1 AND password = $2',
      [username, password]
    )

    if (result.rows.length > 0) {
      const user = result.rows[0]
      res.json({ success: true, user: { id: user.id, username: user.username, nombre: user.nombre } })
    } else {
      res.status(401).json({ success: false, error: 'Credenciales inválidas' })
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Obtener todas
app.get('/api/admin/afiliaciones', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM afiliaciones ORDER BY fecha_creacion DESC')
    res.json({ success: true, afiliaciones: result.rows })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Confirmar pago
app.put('/api/admin/afiliaciones/:codigo/confirmar', async (req, res) => {
  try {
    const { codigo } = req.params
    const { notas } = req.body

    const query = `
      UPDATE afiliaciones 
      SET estado = 'pagado', fecha_pago = CURRENT_TIMESTAMP, notas_asesor = $1 
      WHERE codigo_pago = $2
    `
    await pool.query(query, [notas || '', codigo])
    res.json({ success: true, message: 'Pago confirmado' })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Rechazar
app.put('/api/admin/afiliaciones/:codigo/rechazar', async (req, res) => {
  try {
    const { codigo } = req.params
    const { notas } = req.body

    const query = `
      UPDATE afiliaciones 
      SET estado = 'rechazado', notas_asesor = $1 
      WHERE codigo_pago = $2
    `
    await pool.query(query, [notas || '', codigo])
    res.json({ success: true, message: 'Afiliación rechazada' })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Subir documentos
app.post('/api/admin/afiliaciones/:codigo/documentos', upload.single('documento'), async (req, res) => {
  try {
    const { codigo } = req.params
    const { tipo } = req.body // 'certificado' o 'carnet'

    if (!req.file) return res.status(400).json({ success: false, error: 'No archivo' })

    const fileUrl = `/uploads/${req.file.filename}`
    
    // Construimos la query dinámica dependiendo de si es carnet o certificado
    const campo = tipo === 'certificado' ? 'certificado_url' : 'carnet_url'
    const query = `UPDATE afiliaciones SET ${campo} = $1 WHERE codigo_pago = $2`
    
    await pool.query(query, [fileUrl, codigo])

    res.json({ success: true, message: `${tipo} subido`, url: fileUrl })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Estadísticas (Dashboard)
app.get('/api/admin/estadisticas', async (req, res) => {
  try {
    // Hacemos las sumas directamente en la base de datos (Más eficiente)
    const totalQuery = await pool.query('SELECT COUNT(*) FROM afiliaciones')
    const pendientesQuery = await pool.query("SELECT COUNT(*) FROM afiliaciones WHERE estado = 'pendiente'")
    const pagadosQuery = await pool.query("SELECT COUNT(*) FROM afiliaciones WHERE estado = 'pagado'")
    const rechazadosQuery = await pool.query("SELECT COUNT(*) FROM afiliaciones WHERE estado = 'rechazado'")
    const dineroQuery = await pool.query("SELECT SUM(precio_total) FROM afiliaciones WHERE estado = 'pagado'")

    res.json({
      success: true,
      estadisticas: {
        total: parseInt(totalQuery.rows[0].count),
        pendientes: parseInt(pendientesQuery.rows[0].count),
        pagados: parseInt(pagadosQuery.rows[0].count),
        rechazados: parseInt(rechazadosQuery.rows[0].count),
        ingresoTotal: parseFloat(dineroQuery.rows[0].sum || 0)
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend con PostgreSQL corriendo en puerto ${PORT}`)
})