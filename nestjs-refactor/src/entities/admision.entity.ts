import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PatientEntity } from "./patient.entity";
import { BoxEntity } from "./box.entity";
import { UserEntity } from "./user.entity";
import { AdmisionStudyEntity } from "./admision-study.entity";
import { AdmisionSymptomEntity } from "./admision-symptom.entity";
import { AdmisionDoctorProcedureEntity } from "./admision-doctor-procedure.entity";
import { ShiftChangeEntity } from "./shift-change.entity";
import { AdmisionHistoryEntity } from "./admision-history.entity";

@Entity('admision')
export class AdmisionEntity{ //TODO: Agregar triage
    @PrimaryGeneratedColumn()
    id:number;

    @Column({type:'uuid'})
    id_patient:string;

    @Column({type:'uuid'})
    id_doctor:string;

    @Column({type:'uuid'})
    id_nurse:string;

    @Column()
    id_box:number;

    @Column({type:'timestamp'})
    entry_time:Date;

    @Column({nullable:true,type:'timestamp'})
    departure_time:Date;

    @Column({nullable:true,type:'text'})
    nurse_comment:string | null;

    @Column({nullable:true,type:'text'})
    warning:string | null;

    @ManyToOne(()=>PatientEntity,p=>p.admisions)
    @JoinColumn({name:'id_patient'})
    patient:PatientEntity;

    @OneToOne(()=>BoxEntity,b=>b.admision)
    @JoinColumn({name:'id_box'})
    box:BoxEntity;

    @ManyToOne(()=>UserEntity,u=>u.admisionsAsDoctor)
    @JoinColumn({name:'id_doctor'})
    doctor:UserEntity;

    @ManyToOne(()=>UserEntity,u=>u.admisionsAsNurse)
    @JoinColumn({name:'id_nurse'})
    nurse:UserEntity;

    @OneToMany(()=>AdmisionStudyEntity,as=>as.admision)
    admisionStudies:AdmisionStudyEntity[];

    @OneToMany(()=>AdmisionSymptomEntity,as=>as.admision)
    admisionSymptoms:AdmisionSymptomEntity[];

    @OneToMany(()=>AdmisionDoctorProcedureEntity,adp=>adp.admision)
    admisionDoctorProcedures:AdmisionDoctorProcedureEntity[];

    @OneToMany(()=>ShiftChangeEntity,sc=>sc.admision)
    shiftChanges:ShiftChangeEntity[];

    @OneToMany(()=>AdmisionHistoryEntity,ah=>ah.admision)
    admisionHistories:AdmisionHistoryEntity[];
}