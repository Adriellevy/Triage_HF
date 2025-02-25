import { DocumentType } from "src/domain/document.domain";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AdmisionEntity } from "./admision.entity";

@Entity('patient')
export class PatientEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type:'enum',enum:DocumentType,default:DocumentType.DNI})
    document_type: string;

    @Column()
    document_number: string;

    @Column()
    fullname: string;

    @OneToMany(()=>AdmisionEntity,a=>a.patient)
    admisions: AdmisionEntity[];
}