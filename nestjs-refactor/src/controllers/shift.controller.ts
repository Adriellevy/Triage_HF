import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ShiftOutputDTO } from 'src/domain/shift.domain';
import { JwtRefreshGuard } from 'src/security/auth.guard';
import { ShiftService } from 'src/services/shift.service';

@Controller('shift')
@UseGuards(JwtRefreshGuard)
@ApiTags('Shift')
@ApiBearerAuth()
export class ShiftController {
    constructor(
        private readonly shiftService: ShiftService
    ){}

    @Get('current')
    @ApiOperation({summary:'Obtener el turno que esta en curso'})
    @ApiResponse({status:200,type:ShiftOutputDTO})
    @ApiResponse({status:404,description:'No hay turno en curso'})
    async getCurrentShift():Promise<ShiftOutputDTO>{
        return this.shiftService.getCurrentShift();
    }

    @Get(':id')
    @ApiOperation({summary:'Obtener un turno por su id'})
    @ApiResponse({status:200,type:ShiftOutputDTO})
    @ApiResponse({status:404,description:'No se encontro el turno'})
    @ApiParam({name:'id',required:true,description:'Id del turno',type:Number})
    async getShiftById(@Param('id') id:number):Promise<ShiftOutputDTO>{
        return this.shiftService.getShiftById(id);
    }

    @Get()
    @ApiOperation({summary:'Obtener todos los turnos'})
    @ApiResponse({status:200,type:[ShiftOutputDTO]})
    @ApiQuery({name:'date',required:false,description:'Filtrar por dia',type:String,example:'AAAA-MM-DD'})
    async getAllShifts(@Query('date') date?:string):Promise<ShiftOutputDTO[]>{
        const dateParsed = date ? new Date(date) : undefined;
        return this.shiftService.getAllShifts(dateParsed);
    }

}
