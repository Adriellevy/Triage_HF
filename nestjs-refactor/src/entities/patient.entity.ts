import { DocumentType } from "src/domain/document.domain";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { AdmisionEntity } from "./admision.entity";

@Entity('patient')
@Unique(['document_number','document_type'])
export class PatientEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type:'enum',enum:DocumentType,default:DocumentType.DNI})
    document_type: string;

    @Column()
    document_number: string;

    @Column()
    fullname: string;

    @Column({type:'date',nullable:true})
    birthdate: Date;

    @OneToMany(()=>AdmisionEntity,a=>a.patient)
    admisions: AdmisionEntity[];
}