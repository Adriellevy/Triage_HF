import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { environment } from './environment';
import { DataModule } from './modules/data.module';
import { ServiceModule } from './modules/service.module';
import { AuthController } from './controllers/auth.controller';

const modules = [
  DataModule,
  ServiceModule
]

const controllers = [
  AppController,
  AuthController
]

@Module({
  imports: [
    ConfigModule.forRoot({
      load:[()=>({...environment})],
      isGlobal:true
    }),
    ...modules
  ],
  controllers: controllers,
  providers: [AppService]
})
export class AppModule {}
