import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { SymptomEntity } from "src/entities/symptom.entity";

export class SymptomOutputDTO{
    @ApiProperty({example:1,type:Number,description:'Id del síntoma'})
    id:number;
    @ApiProperty({example:'Convulsiones',description:'Nombre del síntoma',type:String})
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