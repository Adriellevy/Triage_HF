import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtRefreshGuard } from './security/auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtRefreshGuard)
  getHello(): string {
    return this.appService.getHello();
  }
}
