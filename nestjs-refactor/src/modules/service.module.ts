import { Module } from '@nestjs/common';
import { DataModule } from './data.module';
import { AuthService } from 'src/services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { environment } from 'src/environment';
import { JwtRefreshGuard } from 'src/security/auth.guard';
import { BoxService } from 'src/services/box.service';
import { SymptomService } from 'src/services/symptom.service';
import { StudyService } from 'src/services/study.service';
import { DoctorProcedureService } from 'src/services/doctor-procedure.service';
import { UserService } from 'src/services/user.service';
import { TriageService } from 'src/services/triage.service';
const services = [
    AuthService,
    BoxService,
    SymptomService,
    StudyService,
    DoctorProcedureService,
    UserService,
    TriageService
]
const helpers = []
@Module({
    imports:[DataModule, JwtModule.register({
        secret: environment.jwt.secret,
        signOptions: { expiresIn: environment.jwt.expiration }
      })],
    providers:[...services,...helpers,JwtRefreshGuard],
    exports:[...services,...helpers,JwtModule]
})
export class ServiceModule {}
