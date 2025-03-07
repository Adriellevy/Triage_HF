import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('triage')
export class TriageEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    level: string;

    @Column()
    color:string;
}