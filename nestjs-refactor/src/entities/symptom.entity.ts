import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AdmisionSymptomEntity } from "./admision-symptom.entity";

@Entity('symptom')
export class SymptomEntity{
@PrimaryGeneratedColumn()
    id:number

    @Column({type:'varchar',length:256})
    name:string

    @Column({type:'timestamp',nullable:true})
    deleted:Date;
    
    @OneToMany(()=>AdmisionSymptomEntity,as=>as.symptom)
    admisionSymptoms:AdmisionSymptomEntity[]
}