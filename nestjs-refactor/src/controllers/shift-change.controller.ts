import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ShiftChangeInputDTO, ShiftChangeOutput } from 'src/domain/shift.domain';
import { JwtRefreshGuard } from 'src/security/auth.guard';
import { ShiftChangeService } from 'src/services/shift-change.service';

@Controller('shift-change')
@UseGuards(JwtRefreshGuard)
@ApiTags('Shift Change')
@ApiBearerAuth()
export class ShiftChangeController {
    constructor(
        private readonly shiftChangeService: ShiftChangeService
    ){}

    @Get()
    @ApiResponse({status:200,type:[ShiftChangeOutput]})
    @ApiQuery({name:'date',required:false,description:'Filtrar por dia',type:Date})
    @ApiQuery({name:'shift',required:false,description:'Filtrar por turno',type:Number})
    @ApiQuery({name:'patient',required:false,description:'Filtrar por paciente',type:Number})
    async getAll(@Query() date?:Date,@Query() shift?:number,@Query() patient?:number):Promise<ShiftChangeOutput[]>{
        return this.shiftChangeService.getAll(date,shift,patient);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiBody({type:[ShiftChangeInputDTO]})
    async create(@Body() data:ShiftChangeInputDTO[],@Req() req:any):Promise<string>{
        return this.shiftChangeService.create(data,req);
    }
}
