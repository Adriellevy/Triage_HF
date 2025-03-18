import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BoxFilters, BoxInputDTO, BoxOutputDTO, BoxStatus } from 'src/domain/box.domain';
import { Role } from 'src/domain/role.domain';
import { JwtRefreshGuard } from 'src/security/auth.guard';
import { RoleGuard, Roles } from 'src/security/role.guard';
import { BoxService } from 'src/services/box.service';

@Controller('box')
@UseGuards(JwtRefreshGuard,RoleGuard)
@ApiTags('Box')
@ApiBearerAuth()
export class BoxController {
    constructor(
        private readonly boxService: BoxService
    ){}

    @Get()
    @ApiOperation({summary:'Obtener todos los boxes'})
    @ApiResponse({status:200,description:'Retorna todos los boxes',type:[BoxOutputDTO]})
    @ApiResponse({status:401,description:'Unauthorized'})
    @ApiResponse({status:500,description:'Internal Server Error'})
    @ApiQuery({name:'status',required:false,description:'Filtro por status de box',type:String})
    @ApiQuery({name:'type',required:false,description:'Filtro por tipo de box',type:String})
    async getAll(@Query() filters:BoxFilters):Promise<BoxOutputDTO[]>{
        return await this.boxService.getAll(filters);
    }

    @Get(':id')
    @ApiOperation({summary:'Obtener un box por id'})
    @ApiResponse({status:200,description:'Retorna un box',type:BoxOutputDTO,example:BoxOutputDTO})
    @ApiResponse({status:401,description:'Unauthorized'})
    @ApiResponse({status:500,description:'Internal Server Error'})
    @ApiParam({name:'id',required:true,description:'Id del box',type:Number})
    async getById(@Param('id') id:number):Promise<BoxOutputDTO>{
        return await this.boxService.getById(id);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Roles(Role.HOSPITAL_ADMIN)
    @ApiOperation({summary:'Crear un nuevo box'})
    @ApiResponse({status:201,description:'Box creado',type:BoxOutputDTO})
    @ApiResponse({status:401,description:'Unauthorized'})
    @ApiResponse({status:500,description:'Internal Server Error'})
    @ApiBody({type:BoxInputDTO})
    async create(@Body() body:BoxInputDTO):Promise<BoxOutputDTO>{
        return await this.boxService.create(body);
    }

    @Put(':id')
    @Roles(Role.HOSPITAL_ADMIN)
    @ApiOperation({summary:'Actualizar un box'})
    @ApiResponse({status:200,description:'Box actualizado',type:BoxOutputDTO})
    @ApiResponse({status:401,description:'Unauthorized'})
    @ApiResponse({status:404,description:'Box no encontrado'})
    @ApiResponse({status:500,description:'Internal Server Error'})
    @ApiParam({name:'id',required:true,description:'Id del box',type:Number})
    @ApiBody({type:BoxInputDTO})
    async update(@Param('id') id:number,@Body() body:BoxInputDTO):Promise<BoxOutputDTO>{
        return await this.boxService.update(id,body);
    }

    @Delete(':id')
    @Roles(Role.HOSPITAL_ADMIN)
    @ApiOperation({summary:'Eliminar un box'})
    @ApiResponse({status:200,description:'Box eliminado',type:BoxOutputDTO})
    @ApiResponse({status:401,description:'Unauthorized'})
    @ApiResponse({status:404,description:'Box no encontrado'})
    @ApiResponse({status:500,description:'Internal Server Error'})
    @ApiParam({name:'id',required:true,description:'Id del box',type:Number})
    async delete(@Param('id') id:number):Promise<BoxOutputDTO>{
        return await this.boxService.delete(id);
    }
}
