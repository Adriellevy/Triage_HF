import jwt, { type Secret } from 'jsonwebtoken';
import { type ExtendedJwtPayload } from '../interface/jsonwebtoken';

const jwtSecret: Secret = process.env.JWT_SECRET as Secret;

export function verifyToken(token: string): ExtendedJwtPayload {
  if (!jwtSecret) {
    throw new Error('JWT secret not defined');
  }
  return jwt.verify(token, jwtSecret) as ExtendedJwtPayload;
}

export function signToken(userForToken: { id: string; name: string }): string {
  if (!jwtSecret) {
    throw new Error('JWT secret not defined');
  }
  return jwt.sign(userForToken, process.env.JWT_SECRET as Secret);
}
