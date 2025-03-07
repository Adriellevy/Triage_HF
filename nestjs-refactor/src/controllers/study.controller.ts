import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/domain/role.domain';
import { StudyInputDTO, StudyOutputDTO } from 'src/domain/study.domain';
import { JwtRefreshGuard } from 'src/security/auth.guard';
import { RoleGuard, Roles } from 'src/security/role.guard';
import { StudyService } from 'src/services/study.service';

@Controller('study')
@UseGuards(JwtRefreshGuard,RoleGuard)
@ApiTags('Study')
@ApiBearerAuth()
export class StudyController {
    constructor(
        private readonly studyService: StudyService
    ){}

    @Get()
    @ApiOperation({summary:'Obtiene todos los estudios'})
    @ApiResponse({status:200, description:'Obtiene todos los estudios',type:[StudyOutputDTO]})
    @ApiResponse({status:401, description:'Unauthorized'})
    @ApiResponse({status:500, description:'Internal Server Error'})
    @ApiQuery({name:'include_deleted',required:false,description:'Incluir eliminados',type:Boolean})
    async getAllStudies(@Query('include_deleted') deleted?:boolean):Promise<StudyOutputDTO[]>{
        return await this.studyService.getAllStudies(deleted)
    }

    @Get(':id')
    @ApiOperation({summary:'Obtiene un estudio por id'})
    @ApiResponse({status:200, description:'Obtiene un estudio',type:StudyOutputDTO})
    @ApiResponse({status:401, description:'Unauthorized'})
    @ApiResponse({status:404, description:'Estudio no encontrado'})
    @ApiResponse({status:500, description:'Internal Server Error'})
    @ApiParam({name:'id', type:String, description:'Id del estudio'})
    async getStudyById(@Param('id') id: number):Promise<StudyOutputDTO>{
        return await this.studyService.getStudyById(id)
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Roles(Role.HOSPITAL_ADMIN)
    @ApiOperation({summary:'Crea un estudio'})
    @ApiResponse({status:201, description:'Estudio creado',type:StudyOutputDTO})
    @ApiResponse({status:401, description:'Unauthorized'})
    @ApiResponse({status:403, description:'Forbidden, necesitas otro rol'})
    @ApiResponse({status:500, description:'Internal Server Error'})
    @ApiBody({type:StudyInputDTO})
    async createStudy(@Body() body: StudyInputDTO):Promise<StudyOutputDTO>{
        return this.studyService.createStudy(body)
    }

    @Put(':id')
    @Roles(Role.HOSPITAL_ADMIN)
    @ApiOperation({summary:'Actualizar un estudio'})
    @ApiResponse({status:200, description:'Estudio actualizado',type:StudyOutputDTO})
    @ApiResponse({status:401, description:'Unauthorized'})
    @ApiResponse({status:403, description:'Forbidden, necesitas otro rol'})
    @ApiResponse({status:404, description:'Estudio no encontrado'})
    @ApiParam({name:'id', type:String, description:'Id del estudio'})
    @ApiBody({type:StudyInputDTO})
    async updateStudy(@Param('id') id: number, @Body() body: StudyInputDTO):Promise<StudyOutputDTO>{
        return this.studyService.updateStudy(id,body)
    }

    @Delete(':id')
    @Roles(Role.HOSPITAL_ADMIN)
    @ApiOperation({summary:'Eliminar un estudio'})
    @ApiResponse({status:200, description:'Estudio eliminado',type:StudyOutputDTO})
    @ApiResponse({status:401, description:'Unauthorized'})
    @ApiResponse({status:403, description:'Forbidden, necesitas otro rol'})
    @ApiResponse({status:404, description:'Estudio no encontrado'})
    @ApiResponse({status:500, description:'Internal Server Error'})
    @ApiParam({name:'id', type:String, description:'Id del estudio'})
    async deleteStudy(@Param('id') id: number){
        return this.studyService.deleteStudy(id)
    }
}
