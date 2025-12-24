// db.js
import pg from 'pg';
import dotenv from 'dotenv';

// Cargar las variables del archivo .env
dotenv.config();

// Crear la conexión ("Pool" es como un grupo de conexiones listas para usar)
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Necesario para que funcione en Railway/Nube
  }
});

// Probamos la conexión una vez al iniciar
pool.connect((err) => {
  if (err) {
    console.error('❌ Error de conexión a la base de datos', err);
  } else {
    console.log('✅ Conectado exitosamente a PostgreSQL en Railway');
  }
});

export default pool;