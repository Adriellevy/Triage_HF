import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SymptomEntity } from 'src/entities/symptom.entity';
import { environment } from 'src/environment';
import { SymptomRepository } from 'src/repositories/symptom.repository';
const entities = [SymptomEntity]
const repositories = [SymptomRepository]
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
            synchronize: !environment.production ? environment.db.synchronize : environment.production
        }),
        TypeOrmModule.forFeature(repositories)
    ],
    exports:[TypeOrmModule]
})
export class DataModule {}
