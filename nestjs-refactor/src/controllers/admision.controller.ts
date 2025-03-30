import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdmisionInputDTO, AdmisionOutputDTO, AdmisionUpdateDTO } from 'src/domain/admision.domain';
import { JwtRefreshGuard } from 'src/security/auth.guard';
import { AdmisionService } from 'src/services/admision.service';

@Controller('admision')
@UseGuards(JwtRefreshGuard)
@ApiBearerAuth()
@ApiTags('Admision')
export class AdmisionController {
    constructor(private readonly admisionService: AdmisionService) { }

    @Get()
    @ApiResponse({ status: HttpStatus.OK, description: 'Admision found', type: [AdmisionOutputDTO] })
    async getAdmision():Promise<AdmisionOutputDTO[]>{
        return await this.admisionService.getAdmisions();
    }

    @Get(':id')
    @ApiParam({ name: 'id', type: String, required: true })
    @ApiResponse({ status: HttpStatus.OK, description: 'Admision found', type: AdmisionOutputDTO })
    async getAdmisionById(@Param('id') id: number):Promise<AdmisionOutputDTO>{
        return await this.admisionService.getAdmisionById(id);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Admision created', type: AdmisionOutputDTO })
    @ApiBody({ type: AdmisionInputDTO })
    async createAdmision(@Body() admision: AdmisionInputDTO) {
        return this.admisionService.createAdmision(admision);
    }

    @Put(':id')
    @ApiBody({ type: AdmisionUpdateDTO })
    @ApiParam({ name: 'id', type: 'number' })
    async updateAdmision(@Req() req:any,@Param('id') id: number, @Body() admision: AdmisionUpdateDTO) {
        return this.admisionService.updateAdmision(id,admision,req);
    }
}
