import { UserEntity } from "src/entities/user.entity";
import { Role } from "./role.domain";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UserOutputDTO{
    id:string;
    username:string;
    email:string;
    fullname:string;
    speciality:string;
    role:string;

    constructor(u:UserEntity){
        this.id = u.id;
        this.username = u.username;
        this.email = u.email;
        this.fullname = u.fullname;
        this.speciality = u.speciality;
        this.role = u.role;
    }
}

export class UserByTokenInputDTO{
    token:string;
}

export class UserInputDTO{
    @ApiProperty({type:String,example:'user'})
    @IsString()
    @IsNotEmpty()
    username:string;
    @ApiProperty({type:String,example:'password'})
    @IsString()
    @IsNotEmpty()
    password:string;

    @ApiProperty({type:String,example:'user@gmail.com'})
    @IsEmail()
    @IsNotEmpty()
    email:string;

    @ApiProperty({type:String,example:'Name Surname'})
    @IsString()
    @IsNotEmpty()
    fullname:string;

    @ApiProperty({type:String,example:'-----'})
    @IsString()
    @IsOptional()
    speciality:string;

    @ApiProperty({type:String,example:Role.NURSE})
    @IsString()
    @IsNotEmpty()
    role:Role;
}

export class UserUpdateDTO{
    @ApiProperty({type:String,example:'user'})
    @IsString()
    @IsOptional()
    username:string;
    
    @ApiProperty({type:String,example:'password'})
    @IsString()
    @IsOptional()
    password:string;

    @ApiProperty({type:String,example:'user@gmail.com'})
    @IsEmail()
    @IsOptional()
    email:string;

    @ApiProperty({type:String,example:'Name Surname'})
    @IsString()
    @IsOptional()
    fullname:string;

    @ApiProperty({type:String,example:'-----'})
    @IsString()
    @IsOptional()
    speciality:string;

    @ApiProperty({type:String,example:Role.NURSE})
    @IsString()
    @IsOptional()
    role:Role;
}