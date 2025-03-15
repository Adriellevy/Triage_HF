import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { environment } from './environment';
import { DataModule } from './modules/data.module';
import { ServiceModule } from './modules/service.module';
import { AuthController } from './controllers/auth.controller';
import { BoxController } from './controllers/box.controller';
import { SymptomController } from './controllers/symptom.controller';
import { StudyController } from './controllers/study.controller';
import { DoctorProcedureController } from './controllers/doctor-procedure.controller';
import { UserController } from './controllers/user.controller';
import { TriageController } from './controllers/triage.controller';
import { PatientController } from './controllers/patient.controller';
import { AdmisionController } from './controllers/admision.controller';
import { ShiftController } from './controllers/shift.controller';
import { ShiftChangeController } from './controllers/shift-change.controller';






const modules = [
  DataModule,
  ServiceModule
]

const controllers = [
  AppController,
  AdmisionController,
  AuthController,
  BoxController,
  DoctorProcedureController,
  PatientController,
  ShiftChangeController,
  ShiftController,
  StudyController,
  SymptomController,
  TriageController,
  UserController
];


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
