import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PatientInputDTO, PatientOutputDTO, PatientUpdateDTO } from 'src/domain/patient.domain';
import { ValidatorHelper } from 'src/helpers/validator.helper';
import { JwtRefreshGuard } from 'src/security/auth.guard';
import { RoleGuard } from 'src/security/role.guard';
import { PatientService } from 'src/services/patient.service';

@Controller('patient')
@UseGuards(RoleGuard)
@ApiTags('Patient')
@ApiBearerAuth()
export class PatientController {
    constructor(
        private readonly patientService: PatientService,
        
    ){}

    @Get()
    @ApiOperation({summary:'Listar pacientes, opcionalmente paginado'})
    @ApiResponse({status:200,description:'Lista de pacientes',type:[PatientOutputDTO]})
    @ApiQuery({name: 'page', required: false,description:'Numero de pagina',type:Number})
    @ApiQuery({name: 'limit', required: false,description:'Numero de pacientes por pagina',type:Number})
    async getAllPatients(@Query('page') page?:number, @Query('limit') limit?:number):Promise<PatientOutputDTO[]>{
        return await this.patientService.getAllPatients(page,limit);
    }


    @Get(':id')
    @ApiOperation({summary:'Obtener paciente por id'})
    @ApiResponse({status:200,description:'Paciente',type:PatientOutputDTO})
    @ApiResponse({status:400,description:'UUID invalido'})
    @ApiResponse({status:404,description:'Paciente no encontrado'})
    @ApiParam({name: 'id', required: true,description:'Id del paciente',example:'123e4567-e89b-12d3-a456-426655440000',type:String})
    async getPatientById(@Param('id') id:string):Promise<PatientOutputDTO>{
        return await this.patientService.getPatientById(id);
    }

    @Post()
    @ApiOperation({summary:'Crear paciente'})
    @ApiResponse({status:201,description:'Paciente creado',type:PatientOutputDTO})
    @ApiResponse({status:400,description:'Datos invalidos'})
    @ApiBody({type:PatientInputDTO})
    async createPatient(@Body() body:PatientInputDTO):Promise<PatientOutputDTO>{
        return await this.patientService.createPatient(body);
    }

    @Put(':id')
    @ApiOperation({summary:'Actualizar paciente'})
    @ApiResponse({status:200,description:'Paciente actualizado',type:PatientOutputDTO})
    @ApiResponse({status:400,description:'Datos invalidos ó UUID invalido'})
    @ApiResponse({status:404,description:'Paciente no encontrado'})
    @ApiParam({name: 'id', required: true,description:'Id del paciente',example:'123e4567-e89b-12d3-a456-426655440000',type:String})
    @ApiBody({type:PatientUpdateDTO})
    async updatePatient(@Param('id') id:string, @Body() body:PatientUpdateDTO):Promise<PatientOutputDTO>{
        return await this.patientService.updatePatient(id,body);
    }
}
