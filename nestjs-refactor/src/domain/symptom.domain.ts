import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { SymptomEntity } from "src/entities/symptom.entity";

export class SymptomOutputDTO{
    id:number;
    name:string;

    constructor(s:SymptomEntity){
        this.id = s.id;
        this.name = s.name;
    }
}

export class SymptomInputDTO{
    @ApiProperty({example:'Convulsiones'})
    @IsString()
    @IsNotEmpty()
    name:string;
}