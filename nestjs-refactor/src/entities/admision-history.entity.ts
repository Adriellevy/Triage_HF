import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { AdmisionEntity } from "./admision.entity";
import { UserEntity } from "./user.entity";
import { ShiftChangeEntity } from "./shift-change.entity";

@Entity('admision_history')
export class AdmisionHistoryEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    id_admision:number;

    @Column()
    id_user:number; //Usuario que hizo el cambio

    @Column()
    column_updated:string;

    @Column()
    old_value:string;

    @Column()
    new_value:string;

    @Column({type:'timestamp'})
    created_at:Date;

    @ManyToOne(()=>AdmisionEntity, ad=>ad.admisionHistories)
    @JoinColumn({name:'id_admision'})
    admision:AdmisionEntity;

    @ManyToOne(()=>UserEntity, u=>u.admisionHistories)
    @JoinColumn({name:'id_user'})
    user:UserEntity;

    @OneToOne(()=>ShiftChangeEntity, sc=>sc.doctorShiftChange)
    doctorShiftChange:ShiftChangeEntity;

    @OneToOne(()=>ShiftChangeEntity, sc=>sc.nurseShiftChange)
    nurseShiftChange:ShiftChangeEntity;
}