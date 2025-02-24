import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class LoginInputDto {
    @ApiProperty({example:'Dr. Smith'})
    @IsString()
    @IsNotEmpty()
    username: string;
    
    @ApiProperty({example:'password123'})
    @IsString()
    @IsNotEmpty()
    password: string;
}

export class LoginOutputDto {
    username:string;
    token: string;
}

export class TokenPayload{
    username: string;
    sub: string;
    iat: number;
}