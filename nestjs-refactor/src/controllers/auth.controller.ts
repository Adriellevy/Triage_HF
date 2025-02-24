import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginInputDto, LoginOutputDto } from 'src/domain/login.domain';
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
    @ApiResponse({ status: 400, description: 'Error en la solicitud'})
    async login(@Body() body: LoginInputDto):Promise<LoginOutputDto> {
        return this.authSrv.login(body);
    }
}
