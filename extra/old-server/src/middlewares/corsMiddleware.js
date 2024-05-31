import cors from 'cors'

const ACCEPTED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://192.168.0.19:3001',
  'http://192.168.0.83:5173',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://192.168.100.238:5173',
  'http://192.168.0.99:5173',
  'https://w6rv79d1-5173.brs.devtunnels.ms',
  'https://w6rv79d1-5173.brs.devtunnels.ms',
  'https://w6rv79d1-3000.brs.devtunnels.ms',
  'https://w6rv79d1-5173.brs.devtunnels.ms',
  'https://6604828b05248453503b8d33--sparkly-centaur-35769d.netlify.app',
  'https://sparkly-centaur-35769d.netlify.app',
  'https://triage-app.netlify.app',
  'http://181.167.200.30:4173',
]

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  cors({
    origin: (origin, callback) => {
      if (acceptedOrigins.includes(origin)) {
        return callback(null, true)
      }

      if (!origin) {
        return callback(null, true)
      }
      return callback(new Error('Not allowed by CORS'))
    },
  })
