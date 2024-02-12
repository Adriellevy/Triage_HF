import cors from 'cors'

const ACCEPTED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://192.168.0.19:3001',
  'http://192.168.0.83:5173',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://192.168.100.238:5173',
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
