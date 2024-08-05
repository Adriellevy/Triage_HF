import cors from 'cors';
import { type RequestHandler } from 'express';

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
  'http://181.167.193.154:5173',
  'http://192.168.56.1:5173',
  'http://192.168.0.111:5173',
  'http://172.31.224.1:5173',
  'http://192.168.1.40:5173'
];

export const corsMiddleware: (options?: { acceptedOrigins?: string[] }) => RequestHandler = ({
  acceptedOrigins = ACCEPTED_ORIGINS
} = {}) =>
  cors({
    // Función para verificar el origen de la solicitud
    origin: (origin, callback) => {
      if (typeof origin === 'string') {
        // Verifica que origin no sea undefined
        // Si el origen de la solicitud está incluido en la lista de orígenes aceptados, se permite la solicitud
        if (acceptedOrigins.includes(origin)) {
          return callback(null, true);
        }
        // Si el origen de la solicitud no está en la lista de orígenes aceptados, se niega la solicitud
        return callback(new Error('Not allowed by CORS'));
      } else {
        // Si no se proporciona un origen (solicitud del mismo origen), se permite la solicitud
        return callback(null, true);
      }
    }
  });
