import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AdmisionSymptomEntity } from "./admision-symptom.entity";

@Entity('symptom')
export class SymptomEntity{
@PrimaryGeneratedColumn()
    id:number

    @Column({type:'varchar',length:256})
    name:string

    @OneToMany(()=>AdmisionSymptomEntity,as=>as.symptom)
    admisionSymptoms:AdmisionSymptomEntity[]
}