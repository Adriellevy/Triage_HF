import { PatientEntity } from "src/entities/patient.entity";
import { AdmisionOutputDTO } from "./admision.domain";
import { DocumentType } from "./document.domain";
import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class PatientOutputDTO{
    @ApiProperty({type:String,description:'UUID del paciente',example:'205b0a72-017d-4db2-92ec-1a9de8b99f1b'})
    id:string;
    @ApiProperty({type:String,enum:DocumentType,description:'Tipo de documento del paciente',example:DocumentType.DNI})
    document_type:string;
    @ApiProperty({type:String,description:'Numero del documento del paciente',example:'40015200'})
    document_number:string;
    @ApiProperty({type:Date,description:'Fecha de nacimiento del paciente',example:'28-08-2002'})
    birthdate:Date;
    @ApiProperty({type:String,description:'Nombre completo del paciente',example:'José Guidi'})
    fullname:string;
    @ApiProperty({type:[AdmisionOutputDTO],description:'Admisiones del paciente'})
    admisions:AdmisionOutputDTO[];

    constructor(patient:PatientEntity){
        this.id = patient.id;
        this.document_type = patient.document_type;
        this.document_number = patient.document_number;
        this.fullname = patient.fullname;
        this.admisions = patient.admisions ? patient.admisions.map(a=> new AdmisionOutputDTO(a)) : [];
        this.birthdate = patient.birthdate
    }
}

export class PatientInputDTO{
    @ApiProperty({enum:DocumentType})
    @IsEnum(DocumentType)
    @IsNotEmpty()
    document_type:DocumentType;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    document_number:string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    fullname:string;

    @ApiProperty()
    @IsDate()
    @IsOptional()
    birthdate:Date;
}

export class PatientUpdateDTO{
    @ApiProperty({enum:DocumentType})
    @IsEnum(DocumentType)
    @IsOptional()
    document_type:DocumentType;

    @ApiProperty()
    @IsString()
    @IsOptional()
    document_number:string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    fullname:string;

    @ApiProperty()
    @IsDate()
    @IsOptional()
    birthdate:Date;
}