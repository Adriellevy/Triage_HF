import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { AdmisionDoctorProcedureEntity } from "src/entities/admision-doctor-procedure.entity";
import { AdmisionStudyEntity } from "src/entities/admision-study.entity";
import { AdmisionSymptomEntity } from "src/entities/admision-symptom.entity";
import { AdmisionEntity } from "src/entities/admision.entity";

export class AdmisionStudyOutputDTO{
    id:number;
    id_admision:number;
    id_study:number;
    id_user:number;
    status:string;

    constructor(admision:AdmisionStudyEntity){
        this.id = admision.id;
        this.id_admision = admision.id_admision;
        this.id_study = admision.id_study;
        this.id_user = admision.id_user;
        this.status = admision.status;
    }
}

export class AdmisionSymptomOutputDTO{
    id:number;
    id_admision:number;
    id_symptom:number;
    id_user:number;
    status:string;

    constructor(admision:AdmisionSymptomEntity){
        this.id = admision.id;
        this.id_admision = admision.id_admision;
        this.id_symptom = admision.id_symptom;
        this.id_user = admision.id_user;
        this.status = admision.status;
    }
}

export class AdmisionDoctorProcedureOutputDTO{
    id:number;
    id_admision:number;
    id_doctor_procedure:number;
    id_user:number;
    id_doctor:number;
    status:string;

    constructor(admision:AdmisionDoctorProcedureEntity){
        this.id = admision.id;
        this.id_admision = admision.id_admision;
        this.id_doctor_procedure = admision.id_doctor_procedure;
        this.id_user = admision.id_user;
        this.id_doctor = admision.id_doctor;
        this.status = admision.status;
    }
}


export class AdmisionInputDTO{
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    id_patient:string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    id_doctor:string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    id_nurse:string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    id_box:number;

    @ApiProperty()
    @IsOptional()
    @IsDate()
    entry_time:Date; //TODO: Testear si se puede enviar la fecha en formato string con timestamp

    @ApiProperty()
    @IsOptional()
    @IsString()
    nurse_comment:string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    warning:string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    level_triage:string;
    
}

export class AdmisionUpdateDTO{
    @ApiProperty()
    @IsOptional()
    @IsString()
    id_patient:string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    id_doctor:string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    id_nurse:string;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    id_box:number;

    @ApiProperty()
    @IsNotEmpty()
    @IsDate()
    departure_time:Date; //TODO: Testear si se puede enviar la fecha en formato string con timestamp

    @ApiProperty()
    @IsOptional()
    @IsString()
    nurse_comment:string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    warning:string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    level_triage:string;
}


export class AdmisionOutputDTO{
    @ApiProperty({type:Number,example:'1',description:'ID de la admision'})
    id:number;
    @ApiProperty({type:String,example:'',description:'UUID del paciente'})
    id_patient:string;
    @ApiProperty({type:String,example:'',description:'UUID del doctor'})
    id_doctor:string;
    @ApiProperty({type:String,example:'',description:'UUID del enfermero'})
    id_nurse:string;
    @ApiProperty({type:Number,example:'1',description:'ID del box donde se encuentre el paciente'})
    id_box:number;
    @ApiProperty({type:Date,example:'',description:'Fecha de ingreso del paciente'})
    entry_time:Date;
    @ApiProperty({type:Date,example:'',description:'Fecha de salida del paciente'})
    departure_time:Date;
    @ApiProperty({type:String,example:'I',description:'Nivel de triage de la admision'})
    level_triage:string;
    @ApiProperty({type:String,example:'',description:'Comentario del enfermero'})
    nurse_comment:string | null;
    @ApiProperty({type:String,example:'',description:'Aviso de si se debe mostrar una alerta'})
    warning:string | null;
    @ApiProperty({type:[AdmisionStudyOutputDTO],description:'Arreglo de estudios hechos a la admision'})
    admisionStudies:AdmisionStudyOutputDTO[];
    @ApiProperty({type:[AdmisionSymptomOutputDTO],description:'Arreglo de sintomas de la admision'})
    admisionSymptoms:AdmisionSymptomOutputDTO[];
    @ApiProperty({type:[AdmisionDoctorProcedureOutputDTO],description:'Arreglo de procedimientos hechos por el doctor a la admision'})
    admisionDoctorProcedures:AdmisionDoctorProcedureOutputDTO[];

    constructor(admision:AdmisionEntity){
        this.id = admision.id;
        this.id_patient = admision.id_patient;
        this.id_doctor = admision.id_doctor;
        this.id_nurse = admision.id_nurse;
        this.id_box = admision.id_box;
        this.entry_time = admision.entry_time;
        this.level_triage = admision.level_triage;
        this.departure_time = admision.departure_time;
        this.nurse_comment = admision.nurse_comment;
        this.warning = admision.warning;
        this.admisionStudies = admision.admisionStudies ? admision.admisionStudies.map(a=> new AdmisionStudyOutputDTO(a)): [];
        this.admisionSymptoms = admision.admisionSymptoms ? admision.admisionSymptoms.map(a=> new AdmisionSymptomOutputDTO(a)) : [];
        this.admisionDoctorProcedures = admision.admisionDoctorProcedures ? admision.admisionDoctorProcedures.map(a=> new AdmisionDoctorProcedureOutputDTO(a)) : [];
    }
}

