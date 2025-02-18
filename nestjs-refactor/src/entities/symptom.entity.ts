import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('symptom')
export class SymptomEntity{
    @PrimaryGeneratedColumn()
    id:number

    @Column({
            type:'varchar',
            length:256
    })
    name:string
}