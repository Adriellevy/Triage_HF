import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ShiftChangeEntity } from "src/entities/shift-change.entity";
import { ShiftEntity } from "src/entities/shift.entity";

export class ShiftOutputDTO{
    @ApiProperty({type:Number,description:'Id del turno',example:1})
    id:number;
    @ApiProperty({type:String,description:'Dia del turno',example:'2021-09-01'})
    day:string;
    @ApiProperty({type:Number,description:'Hora de inicio del turno',example:8})
    start_hour:number;
    @ApiProperty({type:Number,description:'Hora de fin del turno',example:16})
    end_hour:number;
    @ApiProperty({type:Date,description:'Fecha de creacion del turno',example:'2021-09-01T08:00:00.000Z'})
    created_at:Date;
    @ApiProperty({type:String,description:'UUID del usuario que creo el turno',example:'123e4567-e89b-12d3-a456-426614174000'})
    id_user:string;
    constructor(s:ShiftEntity){
        this.id = s.id;
        this.day = s.day;
        this.start_hour = s.start_hour;
        this.end_hour = s.end_hour;
        this.created_at = s.created_at;
        this.id_user = s.id_user;
    }
}
export class ShiftChangeOutput{
    @ApiProperty({type:Number,description:'Id del cambio de turno',example:1})
    id:number;
    @ApiProperty({type:Number,description:'Id del turno',example:1})
    id_shift:number;
    @ApiProperty({type:Number,description:'Id de la admision',example:1})
    id_admision:number;
    @ApiProperty({type:String,description:'UUID del usuario que creo el turno',example:'123e4567-e89b-12d3-a456-426614174000'})
    id_user:string;
    @ApiProperty({type:String,description:'UUID del doctor anterior',example:'123e4567-e89b-12d3-a456-426614174000'})
    id_last_doctor:string;
    @ApiProperty({type:String,description:'UUID del doctor nuevo',example:'123e4567-e89b-12d3-a456-426614174000'})
    id_new_doctor:string;
    @ApiProperty({type:String,description:'UUID de la enfermera anterior',example:'123e4567-e89b-12d3-a456-426614174000'})
    id_last_nurse:string;
    @ApiProperty({type:String,description:'UUID de la enfermera nueva',example:'123e4567-e89b-12d3-a456-426614174000'})
    id_new_nurse:string;
    @ApiProperty({type:Date,description:'Fecha del cambio de turno',example:'2021-09-01T08:00:00.000Z'})
    shift_change_date:Date;
    @ApiProperty({type:String,description:'Observaciones del paciente',example:'Paciente con fiebre'})
    patient_observations:string;
    @ApiProperty({type:String,description:'Historial del paciente',example:'Paciente con fiebre'})
    patient_records:string;
    @ApiProperty({type:String,description:'Procedimientos del paciente',example:'Paciente con fiebre'})
    patient_procedures:string;

    constructor(s:ShiftChangeEntity){
        this.id = s.id;
        this.id_shift = s.id_shift;
        this.id_admision = s.id_admision;
        this.id_user = s.id_user;
        this.id_last_doctor = s.doctorShiftChange.old_value;
        this.id_new_doctor = s.doctorShiftChange.new_value;
        this.id_last_nurse = s.nurseShiftChange.old_value;
        this.id_new_nurse = s.nurseShiftChange.new_value;
        this.shift_change_date = s.created_at;
        this.patient_observations = s.patient_observations;
        this.patient_records = s.patient_records;
        this.patient_procedures = s.patient_procedures;

    }
}
export class ShiftChangeInputDTO{
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    id_admision:number;
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    id_new_doctor:string;
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    id_new_nurse:string;
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    observations:string;
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    records:string;
}