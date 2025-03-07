import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { StudyEntity } from "src/entities/study.entity";

export enum StudyStatus {
    PENDING = 'PENDING',
    CANCELED = 'CANCELED',
    APPLIED = 'APPLOVED',
}

export class StudyOutputDTO {
    id:number;
    name: string;
    constructor(s:StudyEntity){
        this.id = s.id;
        this.name = s.name;
    }
}

export class StudyInputDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;
}