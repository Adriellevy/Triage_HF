import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { AdmisionEntity } from "./admision.entity";
import { BoxStatus } from "src/domain/box.domain";

@Entity('box')
export class BoxEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    code:string;

    @Column({default:BoxStatus.DISPONIBLE})
    status:string;

    @Column()
    type:string;

    @Column({type:'timestamp',nullable:true})
    time:Date;

    @OneToOne(()=>AdmisionEntity,a=>a.box)
    admision:AdmisionEntity;

}