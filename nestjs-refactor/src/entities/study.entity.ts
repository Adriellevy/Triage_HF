import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AdmisionStudyEntity } from "./admision-study.entity";

@Entity('study')
export class StudyEntity{
    @PrimaryGeneratedColumn()
    id:number

    @Column({
            type:'varchar',
            length:256
    })
    name:string
    
    @OneToMany(()=>AdmisionStudyEntity,as=>as.study)
    admisionStudies:AdmisionStudyEntity[]
    // NICE TO HAVE: Enum con los tipos de procedimientos
}