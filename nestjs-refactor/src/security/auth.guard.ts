import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { TokenPayload } from 'src/domain/login.domain';
import { TokenRepository } from 'src/repositories/token.repository';
import { UserRepository } from 'src/repositories/user.repository';

@Injectable()
export class JwtRefreshGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private tokenRepository: TokenRepository,
    private readonly userRepository: UserRepository,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const authHeader = request.headers.authorization;
    if (!authHeader) throw new UnauthorizedException('Token no proporcionado');

    const token = authHeader.split(' ')[1];
    try {
      const decoded = this.jwtService.verify(token,{ignoreExpiration:false});
      if(decoded.exp < Date.now()) //Access token expired
        throw TokenExpiredError
      request.user = decoded; 
      return true;
    } catch (error) {
      if (error.name === 'TokenExpiredError')
        return await this.handleExpiredToken(token, request, response);
      else
        throw new UnauthorizedException('Token inválido');
    }
  }

  private async handleExpiredToken(token: string, request: Request, response: Response): Promise<boolean> { //DIAGRAMA EXPLICA ESTE MÉTODO
    const payload = this.jwtService.decode(token) as { sub: string };
    if (!payload?.sub) throw new UnauthorizedException('Token inválido');

    const user = await this.userRepository.findOneById(payload.sub);
    if (!user) throw new UnauthorizedException('Usuario no encontrado');
    const userToken = await this.tokenRepository.findByUser(user)

    if (!userToken) throw new UnauthorizedException('Inicia sesión nuevamente');
    this.checkRefreshToken(userToken.refresh_token); // ¿El refresh token venció? Si es así, se lanza una excepción
    const paylodNewToken:TokenPayload = {username:user.username,sub:user.id,iat:Date.now()}
    const newToken = this.jwtService.sign(paylodNewToken);

    response.setHeader('new-access-token', `${newToken}`);
    
    userToken.expired_access_token = userToken.expired_access_token === token ? undefined : token; // El access token vencido, ¿ya se usó?
    await this.tokenRepository.update(userToken);
    if(!userToken.expired_access_token) throw new UnauthorizedException('Token inválido, utilizar el nuevo token proporcionado');

    request.user = { id: payload.sub }; 
    return true;
  }


  private checkRefreshToken(token: string){
    const refreshToken = this.jwtService.decode(token) as { exp: number };
    if(!refreshToken || refreshToken.exp <= Date.now()) throw new UnauthorizedException('Inicia sesión nuevamente');
  }
}
