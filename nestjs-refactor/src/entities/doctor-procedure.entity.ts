import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('doctor_procedure')
export class DoctorProcedureEntity{
    @PrimaryGeneratedColumn()
    id:number

    @Column({type:'varchar',length:256})
    name:string
    
    // NICE TO HAVE: Enum con los tipos de procedimientos


}