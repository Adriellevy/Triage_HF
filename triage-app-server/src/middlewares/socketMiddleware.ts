import { Server } from 'socket.io';
import { type Server as HttpServer } from 'http';
import { type Request, type Response, type NextFunction } from 'express';
import 'dotenv/config';

// Extendemos la interfaz Request para incluir la propiedad io
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      io?: Server;
    }
  }
}

const initializeSocketMiddleware = (
  httpServer: HttpServer
): ((req: Request, res: Response, next: NextFunction) => void) => {
  const io = new Server(httpServer, {
    cors: {
      origin: '*'
    }
  });

  io.on('connect', (socket) => {
    console.log('a user connected', socket?.id);
  });

  return (req: Request, res: Response, next: NextFunction) => {
    req.io = io;
    next();
  };
};

export default initializeSocketMiddleware;
