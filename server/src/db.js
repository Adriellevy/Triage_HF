import mysql from 'mysql2/promise'
import 'dotenv/config'
import fs from 'fs'

const DATABASE_CONFIG = {
  host: process.env.DB_HOST || 'mysql-308b7b2b-triage.a.aivencloud.com',
  user: process.env.DB_USER || 'avnadmin',
  port: process.env.DB_PORT || 21005,
  password: process.env.DB_PASSWORD || 'AVNS_9cEW9B2nxM2t4YydzWh',
  database: process.env.DB_NAME || 'Triage_db',
  ssl: {
    cert: fs.readFileSync('./src/certs/ca.pem'),
  },
}

export const connection = await mysql.createConnection(DATABASE_CONFIG)
