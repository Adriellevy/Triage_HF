import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdmisionDoctorProcedureEntity } from 'src/entities/admision-doctor-procedure.entity';
import { AdmisionHistoryEntity } from 'src/entities/admision-history.entity';
import { AdmisionStudyEntity } from 'src/entities/admision-study.entity';
import { AdmisionSymptomEntity } from 'src/entities/admision-symptom.entity';
import { AdmisionEntity } from 'src/entities/admision.entity';
import { BoxEntity } from 'src/entities/box.entity';
import { DoctorProcedureEntity } from 'src/entities/doctor-procedure.entity';
import { PatientEntity } from 'src/entities/patient.entity';
import { ShiftChangeEntity } from 'src/entities/shift-change.entity';
import { ShiftEntity } from 'src/entities/shift.entity';
import { StudyEntity } from 'src/entities/study.entity';
import { SymptomEntity } from 'src/entities/symptom.entity';
import { TokenEntity } from 'src/entities/token.entity';
import { TriageEntity } from 'src/entities/triage.entity';
import { UserEntity } from 'src/entities/user.entity';
import { environment } from 'src/environment';
import { AdmisionRepository } from 'src/repositories/admision.repository';
import { BoxRepository } from 'src/repositories/box.repository';
import { DoctorProcedureRepository } from 'src/repositories/doctor-procedure.repository';
import { PatientRepository } from 'src/repositories/patient.repository';
import { StudyRepository } from 'src/repositories/study.repository';
import { SymptomRepository } from 'src/repositories/symptom.repository';
import { TokenRepository } from 'src/repositories/token.repository';
import { TriageRepository } from 'src/repositories/triage.repository';
import { UserRepository } from 'src/repositories/user.repository';
const entities = [
    AdmisionDoctorProcedureEntity,
    AdmisionHistoryEntity,
    AdmisionStudyEntity,
    AdmisionSymptomEntity,
    AdmisionEntity,
    BoxEntity,
    DoctorProcedureEntity,
    PatientEntity,
    ShiftChangeEntity,
    ShiftEntity,
    StudyEntity,
    SymptomEntity,
    TokenEntity,
    TriageEntity,
    UserEntity  
]
const repositories = [
    SymptomRepository,
    UserRepository,
    TokenRepository,
    BoxRepository,
    AdmisionRepository,
    DoctorProcedureRepository,
    StudyRepository,
    TriageRepository,
    PatientRepository
]
@Module({
    imports:[
        TypeOrmModule.forRoot({
            type:'mysql',
            host:environment.db.host,
            port:parseInt(environment.db.port),
            username:environment.db.user,
            password:environment.db.password,
            database:environment.db.database,
            entities:entities,
            synchronize: !environment.production && environment.db.synchronize
        }),
        TypeOrmModule.forFeature(entities)
    ],
    providers:[...repositories],
    exports:[TypeOrmModule,...repositories]
})
export class DataModule {}
