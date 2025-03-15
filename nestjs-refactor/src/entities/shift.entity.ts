import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { ShiftChangeEntity } from "./shift-change.entity";

@Entity('shift')
export class ShiftEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    id_user:string;

    @Column({type:'date'})
    day: string;

    @Column()
    start_hour:number;

    @Column()
    end_hour:number;

    @Column()
    created_at:Date;

    @ManyToOne(()=>UserEntity, user=>user.shifts)
    @JoinColumn({name:'id_user'})
    user:UserEntity;

    @OneToMany(()=>ShiftChangeEntity, shiftChange=>shiftChange.shift)
    shiftChanges:ShiftChangeEntity[];
}   