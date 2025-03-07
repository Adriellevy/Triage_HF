import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsString } from "class-validator";
import { TriageEntity } from "src/entities/triage.entity";

export class TriageOutputDTO{
    id: number;
    level: string;
    color: string;

    constructor(t:TriageEntity){
        this.id = t.id;
        this.level = t.level;
        this.color = t.color;
    }
}

export class TriageInputDTO{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    level: string;
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    color: string;
}

export class TriageToSortInputDTO{
    @ApiProperty()
    @IsArray()
    @IsNotEmpty()
    triages: TriageInputDTO[]
}

