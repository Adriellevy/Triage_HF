import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SymptomEntity } from 'src/entities/symptom.entity';
import { TokenEntity } from 'src/entities/token.entity';
import { UserEntity } from 'src/entities/user.entity';
import { environment } from 'src/environment';
import { SymptomRepository } from 'src/repositories/symptom.repository';
import { TokenRepository } from 'src/repositories/token.repository';
import { UserRepository } from 'src/repositories/user.repository';
const entities = [
    SymptomEntity,
    UserEntity,
    TokenEntity,
]
const repositories = [
    SymptomRepository,
    UserRepository,
    TokenRepository
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
