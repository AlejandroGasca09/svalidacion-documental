import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';

// Configurar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Configurar la conexión a PostgreSQL 
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_DATABASE,
});

app.get('/api/status', (req, res) => {
  res.json({ mensaje: 'Validacion de funcionamiento ' });
});

app.listen(PORT, async () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  
  try {

    const res = await pool.query('SELECT NOW()');
    console.log('Conexión exitosa a la base de datos');
  } catch (error) {
    console.error(' Error al conectar con la base de datos:', error);
  }
});