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
    @ApiProperty({type:Number,description:'ID del box',example:1})
    id:number;
    @ApiProperty({type:String,description:'Codigo del box',example:'C-01'})
    code:string;
    @ApiProperty({type:String,enum:BoxType,description:'Tipo del box',example:BoxType.CONSULTORIO})
    type:string;
    @ApiProperty({type:String,description:'Estado del box',example:BoxStatus.DISPONIBLE,enum:BoxStatus})
    status:string;
    @ApiProperty({type:Date,description:'Fecha de cuando se creo el box',example:Date.now(),nullable:true})
    time?:Date;
    @ApiProperty({type:Number,description:'ID de la admision que se encuentra en el box',example:1,nullable:true})
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

    @ApiProperty({example:BoxType.CONSULTORIO,enum:BoxType})
    @IsNotEmpty()
    @IsString()
    type:BoxType;

    @ApiProperty({example:BoxStatus.DISPONIBLE,enum:BoxStatus})
    @IsOptional()
    @IsString()
    status:BoxStatus;
    
    @ApiProperty({description:'Tiempo de cuando se creo'})
    @IsOptional()
    @IsDate()
    time:Date;

}