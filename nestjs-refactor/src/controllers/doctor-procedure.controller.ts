import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DoctorProcedureInputDTO, DoctorProcedureOutputDTO } from 'src/domain/doctor-procedure.domain';
import { Role } from 'src/domain/role.domain';
import { JwtRefreshGuard } from 'src/security/auth.guard';
import { RoleGuard, Roles } from 'src/security/role.guard';
import { DoctorProcedureService } from 'src/services/doctor-procedure.service';

@Controller('doctor-procedure')
@UseGuards(JwtRefreshGuard,RoleGuard)
@ApiTags('Doctor Procedures')
@ApiBearerAuth()
export class DoctorProcedureController {

    constructor(
        private readonly doctorProcedureService: DoctorProcedureService
    ){}

    @Get()
    @ApiOperation({summary:'Obtener todos los procedimientos de doctores'})
    @ApiResponse({status:200,description:'Procedimientos de doctores encontrados',type:[DoctorProcedureOutputDTO]})
    @ApiResponse({status:401,description:'No autorizado'})
    @ApiResponse({status:500,description:'Error del servidor'})
    @ApiQuery({name:'include_deleted',required:false,description:'Incluir eliminados',type:Boolean})
    async getAll(@Query('include_deleted') include_deleted?:boolean):Promise<DoctorProcedureOutputDTO[]>{
        return await this.doctorProcedureService.getAll(include_deleted);
    }

    @Get(':id')
    @ApiOperation({summary:'Obtener un procedimiento de doctor'})
    @ApiResponse({status:200,description:'Procedimiento de doctor encontrado',type:DoctorProcedureOutputDTO})
    @ApiResponse({status:401,description:'No autorizado'})
    @ApiResponse({status:404,description:'Procedimiento de doctor no encontrado'})
    @ApiResponse({status:500,description:'Error del servidor'})
    async getById(@Param('id') id:number):Promise<DoctorProcedureOutputDTO>{
        return await this.doctorProcedureService.getById(id);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Roles(Role.HOSPITAL_ADMIN)
    @ApiOperation({summary:'Crear un procedimiento de doctor'})
    @ApiResponse({status:201,description:'Procedimiento de doctor creado',type:DoctorProcedureOutputDTO})
    @ApiResponse({status:401,description:'No autorizado'})
    @ApiResponse({status:403,description:'Forbiden, necesitas otro rol'})
    @ApiResponse({status:500,description:'Error del servidor'})
    @ApiBody({type:DoctorProcedureInputDTO})
    async create(@Body() body:DoctorProcedureInputDTO):Promise<DoctorProcedureOutputDTO>{
        return await this.doctorProcedureService.create(body);
    }
    
    @Put(':id')
    @Roles(Role.HOSPITAL_ADMIN)
    @ApiOperation({summary:'Actualizar un procedimiento de doctor'})
    @ApiResponse({status:200,description:'Procedimiento de doctor actualizado',type:DoctorProcedureOutputDTO})
    @ApiResponse({status:401,description:'No autorizado'})
    @ApiResponse({status:403,description:'Forbiden, necesitas otro rol'})
    @ApiResponse({status:404,description:'Procedimiento de doctor no encontrado'})
    @ApiResponse({status:500,description:'Error del servidor'})
    @ApiBody({type:DoctorProcedureInputDTO})
    @ApiParam({name:'id',required:true,description:'Id del procedimiento de doctor',type:Number})
    async update(@Param('id') id:number,@Body() body:DoctorProcedureInputDTO):Promise<DoctorProcedureOutputDTO>{
        return await this.doctorProcedureService.update(id,body);
    }

    @Delete(':id')
    @Roles(Role.HOSPITAL_ADMIN)
    @ApiOperation({summary:'Eliminar un procedimiento de doctor'})
    @ApiResponse({status:200,description:'Procedimiento de doctor eliminado'})
    @ApiResponse({status:401,description:'No autorizado'})
    @ApiResponse({status:403,description:'Forbiden, necesitas otro rol'})
    @ApiResponse({status:404,description:'Procedimiento de doctor no encontrado'})
    @ApiResponse({status:500,description:'Error del servidor'})
    @ApiParam({name:'id',required:true,description:'Id del procedimiento de doctor',type:Number})
    async delete(@Param('id') id:number):Promise<DoctorProcedureOutputDTO>{
        return await this.doctorProcedureService.delete(id);
    }
}
