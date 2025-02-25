import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { LoginInputDto, LoginOutputDto, TokenPayload } from 'src/domain/login.domain';
import * as bcrypt from 'bcrypt';
import { UserRepository } from 'src/repositories/user.repository';
import { TokenRepository } from 'src/repositories/token.repository';
import { JwtService } from '@nestjs/jwt';
import { environment } from 'src/environment';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository:UserRepository,
        private readonly tokenRepository:TokenRepository,
        private readonly jwtSrv: JwtService
    ) {}

    async login(body: LoginInputDto): Promise<LoginOutputDto> {
        try{
            const user = await this.userRepository.findByUsername(body.username);
            if (!user) 
                throw new UnauthorizedException('Credenciales incorrectas. Por favor, verifica tu nombre de usuario y contraseña.')
            
            if(!await this.validatePassword(body.password, user.password)) 
                throw new UnauthorizedException('Credenciales incorrectas. Por favor, verifica tu nombre de usuario y contraseña.')
            
            const payload:TokenPayload = {username: user.username, sub: user.id, iat: Date.now()};
            const token = this.jwtSrv.sign(payload)
    
            const payloadRefreshToken:TokenPayload = {username: user.username, sub: user.id, iat: Date.now()};
            const refreshToken = this.jwtSrv.sign(payloadRefreshToken, {expiresIn: environment.jwt.refreshTokenExpiration});
            
            const tokenEntity = await this.tokenRepository.findByUser(user);
            if(tokenEntity) {
                tokenEntity.refresh_token = refreshToken;
                await this.tokenRepository.update(tokenEntity);
            }else{
                await this.tokenRepository.create(user, refreshToken,new Date());
            }
            return {username: body.username, token: token};
        }catch(err){
            throw new InternalServerErrorException(err.message)
        }
    }   


    private async validatePassword(password: string, userPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, userPassword);
    }
}
