import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/domain/role.domain';
import { SymptomInputDTO, SymptomOutputDTO } from 'src/domain/symptom.domain';
import { JwtRefreshGuard } from 'src/security/auth.guard';
import { RoleGuard, Roles } from 'src/security/role.guard';
import { SymptomService } from 'src/services/symptom.service';

@Controller('symptom')
@UseGuards(JwtRefreshGuard,RoleGuard)
@ApiTags('Symptom')
@ApiBearerAuth()
export class SymptomController {
    constructor(
        private readonly symptomService: SymptomService
    ){}

    @Get()
    @ApiOperation({summary:'Obtiene todos los síntomas'})
    @ApiResponse({status:200, description:'Obtiene todos los síntomas',type:[SymptomOutputDTO]})
    @ApiResponse({status:401, description:'Unauthorized'})
    @ApiResponse({status:500, description:'Internal Server Error'})
    @ApiQuery({name:'include_deleted',required:false,description:'Incluir eliminados',type:String})
    async getAll(@Query('include_deleted') deleted?:string):Promise<SymptomOutputDTO[]>{
        return await this.symptomService.getAll(deleted ? deleted === 'true' : false);
    }

    @Get(':id')
    @ApiOperation({summary:'Obtiene un síntoma por id'})
    @ApiResponse({status:200, description:'Obtiene un síntoma',type:SymptomOutputDTO})
    @ApiResponse({status:401, description:'Unauthorized'})
    @ApiResponse({status:404, description:'Sintoma no encontrado'})
    @ApiResponse({status:500, description:'Internal Server Error'})
    @ApiParam({name:'id', type:Number, description:'Id del síntoma'})
    async getById(@Param('id') id:number):Promise<SymptomOutputDTO>{
        return await this.symptomService.getById(id);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Roles(Role.HOSPITAL_ADMIN)
    @ApiOperation({summary:'Crea un síntoma'})
    @ApiResponse({status:201, description:'Síntoma creado',type:SymptomOutputDTO})
    @ApiResponse({status:400, description:'Bad Request, ya existe un sintoma con ese nombre'})
    @ApiResponse({status:401, description:'Unauthorized'})
    @ApiResponse({status:403, description:'Forbidden, necesitas otro rol'})
    @ApiResponse({status:500, description:'Internal Server Error'})
    @ApiBody({type:SymptomInputDTO})
    async create(@Body() symptom:SymptomInputDTO):Promise<SymptomOutputDTO>{
        return await this.symptomService.create(symptom);
    }

    @Put(':id')
    @Roles(Role.HOSPITAL_ADMIN)
    @ApiOperation({summary:'Actualizar un síntoma'})
    @ApiResponse({status:200, description:'Síntoma actualizado',type:SymptomOutputDTO})
    @ApiResponse({status:400, description:'Bad Request, ya existe un sintoma con ese nombre'})
    @ApiResponse({status:401, description:'Unauthorized'})
    @ApiResponse({status:403, description:'Forbidden, necesitas otro rol'})
    @ApiResponse({status:404, description:'Sintoma no encontrado'})
    @ApiResponse({status:500, description:'Internal Server Error'})
    @ApiBody({type:SymptomInputDTO})
    @ApiParam({name:'id', type:Number, description:'Id del síntoma'})
    async update(@Body() symptom:SymptomInputDTO,@Param('id') id:number):Promise<SymptomOutputDTO>{
        return await this.symptomService.update(id,symptom);
    }


    @Delete(':id')
    @Roles(Role.HOSPITAL_ADMIN)
    @ApiOperation({summary:'Eliminar un síntoma'})
    @ApiResponse({status:200, description:'Síntoma eliminado',type:SymptomOutputDTO})
    @ApiResponse({status:401, description:'Unauthorized'})
    @ApiResponse({status:403, description:'Forbidden, necesitas otro rol'})
    @ApiResponse({status:404, description:'Sintoma no encontrado'})
    @ApiResponse({status:500, description:'Internal Server Error'})
    @ApiBody({type:SymptomInputDTO})
    @ApiParam({name:'id', type:Number, description:'Id del síntoma'})
    async delete(@Param('id') id:number):Promise<SymptomOutputDTO>{
        return await this.symptomService.delete(id);
    }
}
