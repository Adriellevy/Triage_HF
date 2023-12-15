import mysql from 'mysql2/promise'
import 'dotenv/config'

const DATABASE_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  port: process.env.DB_PORT || 3000,
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'Triage_db',
}

export const connection = await mysql.createConnection(DATABASE_CONFIG)
