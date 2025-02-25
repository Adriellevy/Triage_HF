import { StudyStatus } from "src/domain/study.domain";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { AdmisionEntity } from "./admision.entity";
import { StudyEntity } from "./study.entity";
import { SymptomEntity } from "./symptom.entity";

@Entity('admision_symptom')
export class AdmisionSymptomEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    id_admision:number;

    @Column()
    id_study:number;

    @Column()
    id_user:number;

    @Column({type:'enum',enum:StudyStatus,default:StudyStatus.PENDING})
    status:string;

    @Column()
    created_at:Date;

    @ManyToOne(()=>AdmisionEntity,admision=>admision.admisionSymptoms)
    @JoinColumn({name:'id_admision'})
    admision:AdmisionEntity;

    @ManyToOne(()=>SymptomEntity,study => study.admisionSymptoms)
    @JoinColumn({name:'id_study'})
    symptom:SymptomEntity;


}