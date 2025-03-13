import { PatientEntity } from "src/entities/patient.entity";
import { AdmisionOutputDTO } from "./admision.domain";
import { DocumentType } from "./document.domain";
import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class PatientOutputDTO{
    id:string;
    document_type:string;
    document_number:string;
    fullname:string;
    admisions:AdmisionOutputDTO[];

    constructor(patient:PatientEntity){
        this.id = patient.id;
        this.document_type = patient.document_type;
        this.document_number = patient.document_number;
        this.fullname = patient.fullname;
        this.admisions = patient.admisions ? patient.admisions.map(a=> new AdmisionOutputDTO(a)) : [];
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