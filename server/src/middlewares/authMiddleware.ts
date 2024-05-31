import 'dotenv/config';
import jwt, {
  type Secret,
  type VerifyErrors,
  JsonWebTokenError,
  TokenExpiredError
} from 'jsonwebtoken';
import { type Request, type Response, type NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user?: any; // Define la propiedad user en el tipo Request
}

const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authorizationHeader = req.header('Authorization');

  if (authorizationHeader == null) {
    res.status(401).json({ error: 'Access Denied - Token not provided' });
  } else {
    const [bearer, token] = authorizationHeader.split(' ');

    if (bearer !== 'Bearer' || token === undefined || token === '') {
      res.status(401).json({ error: 'Access Denied - Invalid Authorization Header' });
    }

    jwt.verify(token, process.env.JWT_SECRET as Secret, (err: VerifyErrors | null, user) => {
      if (err != null) {
        if (err instanceof JsonWebTokenError) {
          res.status(401).json({ error: 'Access Denied - Invalid Token' });
        }
        if (err instanceof TokenExpiredError) {
          res.status(401).json({ error: 'Access Denied - Token Expired' });
        }
        res.status(500).json({ error: 'Internal Server Error' });
      }

      req.user = user;
      next();
    });
  }
};

export default authenticateToken;
