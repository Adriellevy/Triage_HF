import 'dotenv/config';
import { type Request, type Response, type NextFunction } from 'express';
import { verifyToken, verifyRefreshToken, signTokenWithExpiration } from '../helpers/authhelper';
import tokensController from '../controllers/tokensController';
import TokensModel from '../models/mysql/TokensModel';
import jwt, { JwtPayload } from 'jsonwebtoken';
import {
  SendRefreshTokenExpiredNotification,
  SendTokenExpiredNotification
} from '../helpers/notificationhelper';

interface AuthenticatedRequest extends Request {
  user?: unknown; // Define la propiedad user en el tipo Request
}

const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authorizationHeader = req.header('Authorization');

  if (!authorizationHeader) {
    res.status(401).json({ error: 'Access Denied - Token not provided' });
    return;
  }

  const [bearer, token] = authorizationHeader.split(' ');

  if (bearer !== 'Bearer' || !token) {
    res.status(401).json({ error: 'Access Denied - Invalid Authorization Header' });
    return;
  }

  // Vemos si el token JWT del usuario sigue siendo válido, tira excepcion si vence y le
  // devuelve al mismo un nuevo token
  try {
    verifyToken(token);
  } catch (err) {
    if (err.name === 'TokenExpiredError' || err.message === 'jwt expired') {
      const decoded = jwt.decode(token);

      // Verificamos que 'decoded' es un objeto y no un string
      if (decoded && typeof decoded !== 'string') {
        // console.log('Se actualizo el token del usuario: ', decoded.name);
        // Accedemos a las propiedades del token decodificado
        const userForToken = {
          id: decoded.id, // Verificamos que es JwtPayload y accedemos a 'id'
          name: decoded.name // Verificamos que es JwtPayload y accedemos a 'name'
        };
        SendTokenExpiredNotification(req, decoded.id as string);
        const newAccessToken = signTokenWithExpiration(userForToken, 10 / 3600);
        res.status(206).json({ newAccessToken });
      } else {
        // Manejo del caso en que 'decoded' sea un string o no sea válido
        console.log('No se pudo decodificar el token correctamente.');
      }

      return;
    } else {
      console.log('Otro error al verificar el token:', err);
    }
  }

  // Verificamos si el refresh token de la base de datos es valido
  try {
    const user = verifyToken(token);

    if (!user) {
      res.status(401).json({ error: 'Access Denied - Invalid Token' });
      return;
    }

    // Asignamos el usuario al request para usarlo en rutas protegidas
    req.user = user;
    // console.log('Usario que pidio la req', user);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const refresh_token_database = await TokensModel.findTokenByUserId(user.id);
    if (refresh_token_database) {
      // Verificamos si el refresh token del usuario sigue siendo válido
      verifyToken(refresh_token_database.refresh_token);
      // console.log('refresh token database:', refresh_token_database);
    }
    // Continuamos con la siguiente middleware o ruta
    next();
  } catch (err) {
    // Manejamos los distintos tipos de errores que pueden ocurrir
    if (err.name === 'TokenExpiredError' || err.name === 'jwt malformed') {
      console.log('Se envio el 207');
      const user = verifyToken(token);
      SendRefreshTokenExpiredNotification(req, user.id);
      res.status(207).json({ error: '207' }); // Puedes enviar el nuevo refresh token en la respuesta
    } else if (err.message === 'Token expired') {
      res.status(401).json({ error: 'Access Denied - Token Expired' });
    } else if (err.message === 'Token not found in database' || err.message === 'Invalid Token') {
      res.status(401).json({ error: 'Access Denied - Invalid Token' });
    } else {
      console.error('Error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

export default authenticateToken;
