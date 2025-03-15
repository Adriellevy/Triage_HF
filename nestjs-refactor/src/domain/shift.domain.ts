import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ShiftChangeEntity } from "src/entities/shift-change.entity";
import { ShiftEntity } from "src/entities/shift.entity";

export class ShiftOutputDTO{
    id:number;
    day:string;
    start_hour:number;
    end_hour:number;
    created_at:Date;
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
    id:number;
    id_shift:number;
    id_admision:number;
    id_user:string;
    id_last_doctor:string;
    id_new_doctor:string;
    id_last_nurse:string;
    id_new_nurse:string;
    shift_change_date:Date;
    patient_observations:string;
    patient_records:string;
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