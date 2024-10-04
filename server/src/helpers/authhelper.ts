import jwt, { JwtPayload, type Secret } from 'jsonwebtoken';
import { type ExtendedJwtPayload } from '../interface/jsonwebtoken';
import TokensModel from '../models/mysql/TokensModel';

const jwtSecret: Secret = process.env.JWT_SECRET as Secret;

export function verifyToken(token: string): ExtendedJwtPayload {
  if (!jwtSecret) {
    throw new Error('JWT secret not defined');
  }
  return jwt.verify(token, jwtSecret) as ExtendedJwtPayload;
}

// export async function verifyToken(token: string): Promise<ExtendedJwtPayload> {
//   if (!jwtSecret) {
//     throw new Error('JWT secret not defined');
//   }
//   const verified_token = jwt.verify(token, jwtSecret) as ExtendedJwtPayload;
//   await verifyRefreshToken(token, verified_token.id);
//   return verified_token;
// }
export function signToken(userForToken: { id: string; name: string }): string {
  if (!jwtSecret) {
    throw new Error('JWT secret not defined');
  }
  return jwt.sign(userForToken, process.env.JWT_SECRET as Secret);
  //  return jwt.sign(userForToken, process.env.JWT_SECRET as Secret, { expiresIn: '30s' });
}

export function signTokenWithExpiration(
  userForToken: { id: string; name: string },
  expiration_hours: number
): string {
  const refreshToken = jwt.sign(userForToken, process.env.JWT_SECRET as Secret, {
    expiresIn: `${expiration_hours}h`
  });
  return refreshToken;
}

export async function verifyRefreshToken(token: string): Promise<string | ExtendedJwtPayload> {
  const decoded = jwt.verify(token, process.env.JWT_SECRET as Secret) as ExtendedJwtPayload;

  // Si el token JWT es válido, buscamos el token en la base de datos
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const tokenRecord = await TokensModel.findTokenByUserId(decoded.id);
    if (!tokenRecord) {
      throw new Error('Token not found in database');
    }
    console.log('Token refresh', tokenRecord);
    // Comprobamos si el token ha expirado basado en la fecha de la base de datos
    if (jwt.verify(tokenRecord.refresh_token, process.env.JWT_SECRET as Secret)) {
      throw new Error('Token expired in database');
    }
  } catch (dbError) {
    throw new Error('Error checking token in database');
  }
  return decoded;
}

export const IsValidToken = (token: string): string | JwtPayload | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as Secret);
    return decoded;
  } catch (error) {
    return null; // Token no válido o expirado
  }
};
