import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AdmisionDoctorProcedureEntity } from "./admision-doctor-procedure.entity";

@Entity('doctor_procedure')
export class DoctorProcedureEntity{
    @PrimaryGeneratedColumn()
    id:number

    @Column({type:'varchar',length:256})
    name:string
    
    @Column({type:'timestamp',nullable:true})
    deleted:Date;
    // NICE TO HAVE: Enum con los tipos de procedimientos

    @OneToMany(()=>AdmisionDoctorProcedureEntity,adp=>adp.doctorProcedure)
    admisionDoctorProcedures:AdmisionDoctorProcedureEntity[]
}