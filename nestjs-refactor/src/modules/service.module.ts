import { Module } from '@nestjs/common';
import { DataModule } from './data.module';
import { AuthService } from 'src/services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { environment } from 'src/environment';
import { JwtStrategy } from 'src/security/jwt.strategy';
const services = [
    AuthService
]
const helpers = []
@Module({
    imports:[DataModule, JwtModule.register({
        secret: environment.jwt.secret,
        signOptions: { expiresIn: environment.jwt.expiration }
      })],
    providers:[...services,...helpers,JwtStrategy],
    exports:[...services,...helpers]
})
export class ServiceModule {}
