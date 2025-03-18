import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsString } from "class-validator";
import { TriageEntity } from "src/entities/triage.entity";

export class TriageOutputDTO{
    @ApiProperty({type:Number,example:1,description:'Id del nivel de triage'})
    id: number;
    @ApiProperty({type:String,example:'I',description:'Nivel de triage'})
    level: string;
    @ApiProperty({type:String,example:'0,0,128',description:'Color del nivel de triage'})
    color: string;

    constructor(t:TriageEntity){
        this.id = t.id;
        this.level = t.level;
        this.color = t.color;
    }
}

export class TriageInputDTO{
    @ApiProperty({type:String,example:'I'})
    @IsString()
    @IsNotEmpty()
    level: string;
    @ApiProperty({type:String,example:'0,0,128'})
    @IsString()
    @IsNotEmpty()
    color: string;
}


