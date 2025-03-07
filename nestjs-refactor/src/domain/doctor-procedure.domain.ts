import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { DoctorProcedureEntity } from "src/entities/doctor-procedure.entity";

export enum DoctorProcedureStatus{
    PENDING='PENDING',
    ACCEPTED='ACCEPTED',
    REJECTED='REJECTED',
    CANCELLED='CANCELLED',
    COMPLETED='COMPLETED'
}

export class DoctorProcedureOutputDTO{
    id:number;
    name:string;

    constructor( dp:DoctorProcedureEntity){
        this.id=dp.id;
        this.name = dp.name;
    }
}

export class DoctorProcedureInputDTO{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name:string;
}