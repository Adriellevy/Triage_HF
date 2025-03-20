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
    @ApiQuery({name:'date',required:false,description:'Filtrar por dia (YYYY-MM-DD)',type:String})
    @ApiQuery({name:'shift',required:false,description:'Filtrar por id turno',type:Number})
    @ApiQuery({name:'admision',required:false,description:'Filtrar por id admision',type:Number})
    async getAll(@Query('date') date?:string,@Query('shift') shift?:number,@Query('admision') admision?:number):Promise<ShiftChangeOutput[]>{
        const dateParsed = date ? new Date(date) : undefined;
        return this.shiftChangeService.getAll(dateParsed,shift,admision);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiBody({type:[ShiftChangeInputDTO]})
    async create(@Body() data:ShiftChangeInputDTO[],@Req() req:any):Promise<ShiftChangeOutput[]>{
        return this.shiftChangeService.create(data,req);
    }
}
