import { Module } from '@nestjs/common';
import { DataModule } from './data.module';
const services = []
const helpers = []
@Module({
    imports:[DataModule],
    providers:[...services,...helpers],
    exports:[...services,...helpers]
})
export class ServiceModule {}
