import { Buffer } from 'buffer';
import { type RowDataPacket, type FieldPacket } from 'mysql2';
import 'dotenv/config';
import { connect } from '../../config/db';
// conexión a la base de datos

// Definición de la interfaz para los tokens
interface Token {
  token_id: string;
  refresh_token: string;
  user_id: string;
}

interface UUIDResult extends RowDataPacket {
  uuid: string;
}

interface TokenRow extends RowDataPacket {
  user_id: string;
  refresh_token: string;
}
class TokensModel {
  // Método para agregar un token
  static async addToken(userId: string, refreshToken: string): Promise<Token> {
    const conn = await connect();
    const [uuidResult] = await conn.query<UUIDResult[]>('SELECT UUID() uuid;');
    const [{ uuid }] = uuidResult;
    const query = `
      INSERT INTO Tokens (token_id, refresh_token, user_id)
      VALUES (UUID_TO_BIN(?), ?, UUID_TO_BIN(?))
    `;

    await conn.execute(query, [uuid, refreshToken, userId]);
    return {
      token_id: uuid,
      refresh_token: refreshToken,
      user_id: userId
    };
  }

  // Método para eliminar un token
  static async deleteToken(tokenId: string): Promise<void> {
    const query = `
      DELETE FROM Tokens WHERE token_id = UUID_TO_BIN(?)
    `;
    const conn = await connect();
    await conn.execute(query, [tokenId]);
  }

  // Método para actualizar un token
  static async updateToken(tokenId: string, newRefreshToken: string): Promise<string> {
    const query = `
      UPDATE Tokens
      SET refresh_token = ?
      WHERE token_id = UUID_TO_BIN(?)
    `;
    const conn = await connect();
    await conn.execute(query, [newRefreshToken, tokenId]);
    return newRefreshToken;
  }

  // Método para encontrar un token por ID de usuario
  static async findTokenByUserId(userId: string): Promise<Token | null> {
    const query = `
      SELECT BIN_TO_UUID(token_id) AS token_id, refresh_token, BIN_TO_UUID(user_id) AS user_id
      FROM Tokens
      WHERE user_id = UUID_TO_BIN(?)
    `;

    const conn = await connect();
    const [rows]: [RowDataPacket[], FieldPacket[]] = await conn.execute(query, [userId]);
    return rows.length ? (rows[0] as Token) : null;
  }

  // Método para encontrar un token por ID de token
  static async findTokenByTokenId(tokenId: string): Promise<Token | null> {
    const query = `
      SELECT BIN_TO_UUID(token_id) AS token_id, refresh_token, BIN_TO_UUID(user_id) AS user_id
      FROM Tokens
      WHERE token_id = UUID_TO_BIN(?)
    `;
    const conn = await connect();
    const [rows]: [RowDataPacket[], FieldPacket[]] = await conn.execute(query, [tokenId]);
    return rows.length ? (rows[0] as Token) : null;
  }

  static async getTokensForUsers(): Promise<Array<{ user_id: string; refresh_token: string }>> {
    const conn = await connect();

    // Consulta SQL para obtener los tokens y el ID de usuario
    const query = `
      SELECT BIN_TO_UUID(user_id) AS user_id, refresh_token 
      FROM Tokens;
    `;

    const [rows] = await conn.query<TokenRow[]>(query);

    // Devolver los resultados en el formato necesario
    return rows;
  }
}

export = TokensModel;
