import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { HTTP_CODE_METADATA } from '@nestjs/common/constants';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginInputDto, LoginOutputDto } from 'src/domain/login.domain';
import { JwtRefreshGuard } from 'src/security/auth.guard';
import { AuthService } from 'src/services/auth.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(
        private readonly authSrv: AuthService
    ) {}

    @Post('login')
    @ApiOperation({ summary: 'Obtener token' })
    @ApiBody({ type: LoginInputDto })
    @ApiResponse({ status: 200, description: 'Token generado',type: LoginOutputDto})
    @ApiResponse({ status: 401, description: 'Credeciales incorrectas'})
    @ApiResponse({ status: 500, description: 'Error interno del servidor, leer mensaje de error'})
    async login(@Body() body: LoginInputDto):Promise<LoginOutputDto> {
        return this.authSrv.login(body);
    }

    @Post('logout')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Cerrar sesión' })
    @ApiResponse({ status: 204, description: 'Sesión cerrada'})
    @ApiResponse({status:404, description: 'Token no encontrado'})
    @ApiResponse({ status: 500, description: 'Error interno del servidor, leer mensaje de error'})
    @ApiBearerAuth()
    async logout(@Req() req:any):Promise<void> {
        return await this.authSrv.logout(req);
    }

}
