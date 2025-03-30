import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/domain/role.domain';
import { TriageInputDTO, TriageOutputDTO } from 'src/domain/triage.domain';
import { JwtRefreshGuard } from 'src/security/auth.guard';
import { RoleGuard, Roles } from 'src/security/role.guard';
import { TriageService } from 'src/services/triage.service';

@Controller('triage')
@UseGuards(JwtRefreshGuard,RoleGuard)
@ApiTags('Triage')
@ApiBearerAuth()
export class TriageController {
    constructor(
        private readonly triageService: TriageService
    ){}

    @Get()
    @ApiOperation({ summary: 'Obtener todos los niveles de triage' })
    @ApiResponse({status:200,description:'Todos los triage obtenidos',type:[TriageOutputDTO]})
    @ApiResponse({status:401,description:'No autorizado'})
    @ApiResponse({status:500,description:'Error del servidor'})
    async getAllTriage():Promise<TriageOutputDTO[]>{
        return await this.triageService.getAllTriage();
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Roles(Role.HOSPITAL_ADMIN)
    @ApiOperation({ summary: 'Crear un nuevo nivel de triage'})
    @ApiResponse({status:201,description:'Triage creado',type:TriageOutputDTO})
    @ApiResponse({status:400,description:'Datos inválidos, formato incorrecto de color'})
    @ApiResponse({status:401,description:'No autorizado'})
    @ApiResponse({status:403,description:'No tiene permisos para realizar esta acción'})
    @ApiBody({type:TriageInputDTO})
    async createTriage(@Body() body:TriageInputDTO):Promise<TriageOutputDTO>{
        return await this.triageService.createTriage(body);
    }

    @Put(':level')
    @Roles(Role.HOSPITAL_ADMIN)
    @ApiOperation({ summary: 'Actualizar un nivel de triage'})
    @ApiResponse({status:200,description:'Triage actualizado',type:TriageOutputDTO})
    @ApiResponse({status:400,description:'Datos inválidos, formato incorrecto de color'})
    @ApiResponse({status:401,description:'No autorizado'})
    @ApiResponse({status:403,description:'No tiene permisos para realizar esta acción'})
    @ApiResponse({status:404,description:'No existe el nivel de triage'})
    @ApiBody({type:TriageInputDTO})
    @ApiParam({name:'level',description:'Nivel de triage a actualizar',type:'string'})
    async updateTriage(@Body() body:TriageInputDTO,@Param('level') level:string):Promise<TriageOutputDTO>{
        return await this.triageService.updateTriage(body,level);
    }

    @Delete(':level')
    @Roles(Role.HOSPITAL_ADMIN)
    @ApiOperation({ summary: 'Eliminar un nivel de triage'})
    @ApiResponse({status:200,description:'Triage eliminado',type:TriageOutputDTO})
    @ApiResponse({status:400,description:'El triage tiene admisiones asociadas'})
    @ApiResponse({status:401,description:'No autorizado'})
    @ApiResponse({status:403,description:'No tiene permisos para realizar esta acción'})
    @ApiResponse({status:404,description:'No existe el nivel de triage'})
    @ApiParam({name:'level',description:'Nivel de triage a actualizar',type:'string'})
    async deleteTriage(@Param('level') level:string):Promise<TriageOutputDTO>{
        return await this.triageService.deleteTriage(level);
    }


    @Post('sort')
    @Roles(Role.HOSPITAL_ADMIN)
    @ApiOperation({summary:'Reordenamiento de los niveles de triage'})
    @ApiResponse({status:200,description:'Nuevo orden de triage.',type:[TriageOutputDTO]})
    @ApiResponse({status:400,description:'El número de triages recibidos no coincide con los existentes en la base de datos.'})
    @ApiResponse({status:401,description:'No autorizado'})
    @ApiResponse({status:403,description:'No tiene permisos para realizar esta acción'})
    @ApiBody({type:[TriageInputDTO]})
    async sortTriage(@Body() body:TriageInputDTO[]):Promise<TriageOutputDTO[]>{
        return await this.triageService.sortTriage(body);
    }
}
