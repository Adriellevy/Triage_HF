import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AdmisionEntity } from "./admision.entity";

@Entity('box')
export class BoxEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    code:string;

    @Column()
    status:string;

    @Column()
    type:string;

    @Column({type:'timestamp'})
    time:Date;

    @OneToMany(()=>AdmisionEntity,a=>a.box)
    admisions:AdmisionEntity[];
}