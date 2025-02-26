import { StudyStatus } from "src/domain/study.domain";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { AdmisionEntity } from "./admision.entity";
import { StudyEntity } from "./study.entity";
import { DoctorProcedureStatus } from "src/domain/doctor-procedure.domain";
import { DoctorProcedureEntity } from "./doctor-procedure.entity";
import { UserEntity } from "./user.entity";

@Entity('admision_doctor_procedure')
export class AdmisionDoctorProcedureEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    id_admision:number;

    @Column()
    id_doctor_procedure:number;

    @Column()
    id_user:number;

    @Column()
    id_doctor:number;

    @Column({type:'enum',enum:DoctorProcedureStatus,default:StudyStatus.PENDING})
    status:string;

    @Column()
    created_at:Date;

    @ManyToOne(()=>AdmisionEntity,admision=>admision.admisionDoctorProcedures)
    @JoinColumn({name:'id_admision'})
    admision:AdmisionEntity;

    @ManyToOne(()=>DoctorProcedureEntity,dp => dp.admisionDoctorProcedures)
    @JoinColumn({name:'id_doctor_procedure'})
    doctorProcedure:DoctorProcedureEntity;

    @ManyToOne(()=>UserEntity,u=>u.admisionDoctorProcedures)
    @JoinColumn({name:'id_user'})
    user:UserEntity;

    @ManyToOne(()=>UserEntity,u=>u.admisionDoctorProceduresAsDoctor)
    @JoinColumn({name:'id_doctor'})
    doctor:UserEntity;

}