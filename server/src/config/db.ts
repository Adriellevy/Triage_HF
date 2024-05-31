import { config } from 'dotenv';

import { type Pool, type ConnectionOptions, createPool } from 'mysql2/promise';

config();
const DATABASE_CONFIG: ConnectionOptions = {
  host: process.env.DB_HOST ?? 'mysqldb',
  user: process.env.DB_USER ?? 'root',
  port: process.env.DB_PORT != null ? parseInt(process.env.DB_PORT, 10) : 3306,
  password: process.env.DB_PASSWORD ?? '1234',
  database: process.env.DB_NAME ?? 'Triagedb'
};

let pool: Pool | null = null;

export async function connect(): Promise<Pool> {
  if (pool) return pool;

  try {
    pool = createPool(DATABASE_CONFIG);
    await pool.query('SELECT 1');
    console.log('Conexión exitosa a la base de datos.');
    return pool;
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error.message);
    throw error;
  }
}
