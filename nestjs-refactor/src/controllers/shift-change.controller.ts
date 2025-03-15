import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ShiftChangeInputDTO } from 'src/domain/shift.domain';
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
    @ApiQuery({name:'date',required:false,description:'Filtrar por dia',type:Date})
    @ApiQuery({name:'shift',required:false,description:'Filtrar por turno',type:Number})
    @ApiQuery({name:'patient',required:false,description:'Filtrar por paciente',type:Number})
    async getAll(@Query() date?:Date,@Query() shift?:number,@Query() patient?:number){
        return this.shiftChangeService.getAll(date,shift,patient);
    }

    @Post()
    @ApiBody({type:[ShiftChangeInputDTO]})
    async create(@Body() data:ShiftChangeInputDTO[],@Req() req:any){
        return this.shiftChangeService.create(data,req);
    }
}
