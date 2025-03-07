import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { BoxEntity } from "src/entities/box.entity";

export enum BoxType{
    CONSULTORIO = 'consultorio',
    LABORATORIO = 'laboratorio',
    SHOCK_ROOM = 'shock room',
    INTERNACION = 'internacion',
    OBSERVACION = 'observacion'
}

export enum BoxStatus{
    DISPONIBLE = 'disponible',
    OCUPADO = 'ocupado'
}

export class BoxOutputDTO{
    id:number;
    code:string;
    type:string;
    status:string;
    time?:Date;
    patient_id?:number;

    constructor(box:BoxEntity){
        this.id = box.id;
        this.code = box.code;
        this.type = box.type;
        this.status = box.status;
        this.time = box?.time ?? null;
        this.patient_id = box.admision?.id ?? null;
    }
}

export class BoxFilters{
    status?:string;
    type?:string;
}

export class BoxInputDTO{
    @ApiProperty({example:'C-01'})
    @IsNotEmpty()
    @IsString()
    code:string;

    @ApiProperty({example:BoxType.CONSULTORIO})
    @IsNotEmpty()
    @IsString()
    type:BoxType;

    @ApiProperty({example:BoxStatus.DISPONIBLE})
    @IsOptional()
    @IsString()
    status:BoxStatus;
    
    @ApiProperty()
    @IsOptional()
    @IsDate()
    time:Date;

}