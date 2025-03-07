import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/domain/role.domain';
import { UserByTokenInputDTO, UserInputDTO, UserOutputDTO, UserUpdateDTO } from 'src/domain/user.domain';
import { JwtRefreshGuard } from 'src/security/auth.guard';
import { RoleGuard, Roles } from 'src/security/role.guard';
import { UserService } from 'src/services/user.service';

@Controller('user')
@UseGuards(JwtRefreshGuard,RoleGuard)
@ApiTags('User')
@ApiBearerAuth()
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @ApiOperation({summary:'Obtener todos los usuarios'})
    @ApiResponse({status:200,description:'Usuarios encontrados',type:[UserOutputDTO]})
    @ApiResponse({status:401,description:'No autorizado'})
    @ApiResponse({status:500,description:'Error del servidor'})
    @ApiQuery({type:String,name:'role',required:false,description:'Filtrar por rol'})
    async findAll(@Query('role') role?: Role): Promise<UserOutputDTO[]> {
        return await this.userService.findAll(role);
    }

    @Get(':id')
    @ApiOperation({summary:'Obtener un usuario por id'})
    @ApiResponse({status:200,description:'Usuario encontrado',type:UserOutputDTO})
    @ApiResponse({status:401,description:'No autorizado'})
    @ApiResponse({status:404,description:'Usuario no encontrado'})
    @ApiResponse({status:500,description:'Error del servidor'})
    async findOne(@Param('id') id: string): Promise<UserOutputDTO> {
        return await this.userService.findOne(id);
    }

    @Post('token')
    @ApiOperation({summary:'Obtener usuario por token'})
    @ApiResponse({status:200,description:'Usuario encontrado',type:UserOutputDTO})
    @ApiResponse({status:400,description:'Petición incorrecta, error en el token'})
    @ApiResponse({status:401,description:'No autorizado'})
    @ApiResponse({status:404,description:'Usuario no encontrado'})
    @ApiResponse({status:500,description:'Error del servidor'})
    async findByToken(@Body() body: UserByTokenInputDTO): Promise<UserOutputDTO> {
        return await this.userService.findByToken(body);
    }

    @Post('')
    @HttpCode(HttpStatus.CREATED)
    @Roles(Role.HOSPITAL_ADMIN)
    @ApiOperation({summary:'Crear un usuario'})
    @ApiResponse({status:201,description:'Usuario creado',type:UserOutputDTO})
    @ApiResponse({status:400,description:'Petición incorrecta'})
    @ApiResponse({status:401,description:'No autorizado'})
    @ApiResponse({status:403,description:'Forbidden, debe tener otro rol'})
    @ApiResponse({status:500,description:'Error del servidor'})
    @ApiBody({type:UserInputDTO})
    async create(@Body() body: UserInputDTO): Promise<UserOutputDTO> {
        return await this.userService.create(body);
    }

    @Put(':id')
    @Roles(Role.HOSPITAL_ADMIN)
    @ApiOperation({summary:'Actualizar un usuario'})
    @ApiResponse({status:200,description:'Usuario actualizado',type:UserOutputDTO})
    @ApiResponse({status:400,description:'Petición incorrecta'})
    @ApiResponse({status:401,description:'No autorizado'})
    @ApiResponse({status:403,description:'Forbidden, debe tener otro rol'})
    @ApiResponse({status:404,description:'Usuario no encontrado'})
    @ApiResponse({status:500,description:'Error del servidor'})
    @ApiBody({type:UserUpdateDTO})
    @ApiParam({name:'id',type:String,required:true,description:'Id del usuario'})
    async update(@Param('id') id: string, @Body() body: UserUpdateDTO): Promise<UserOutputDTO> {
        return await this.userService.update(id, body);
    }

    @Delete(':id')
    @Roles(Role.HOSPITAL_ADMIN)
    @ApiOperation({summary:'Eliminar un usuario'})
    @ApiResponse({status:200,description:'Usuario eliminado',type:UserOutputDTO})
    @ApiResponse({status:401,description:'No autorizado'})
    @ApiResponse({status:403,description:'Forbidden, debe tener otro rol'})
    @ApiResponse({status:404,description:'Usuario no encontrado'})
    @ApiResponse({status:500,description:'Error del servidor'})
    @ApiParam({name:'id',type:String,required:true,description:'Id del usuario'})
    async remove(@Param('id') id: string): Promise<UserOutputDTO> {
        return await this.userService.remove(id);
    }
}
