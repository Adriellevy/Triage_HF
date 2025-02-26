import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ShiftEntity } from "./shift.entity";
import { AdmisionEntity } from "./admision.entity";
import { UserEntity } from "./user.entity";
import { AdmisionHistoryEntity } from "./admision-history.entity";

@Entity('shift_change')
export class ShiftChangeEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    id_shift:number;

    @Column()
    id_user:number; //Usuario que ejecuto el shift change

    @Column()
    id_admision:number;

    @Column({nullable:true})
    id_doctor_change:number;

    @Column({nullable:true})
    id_nurse_change:number;

    @Column({nullable:true})
    patient_observations:string;

    @Column({nullable:true})
    patient_records:string;

    @Column({nullable:true})
    patient_procedures:string;

    @ManyToOne(()=>ShiftEntity, shift=>shift.shiftChanges)
    @JoinColumn({name:'id_shift'})
    shift:ShiftEntity;

    @ManyToOne(()=>AdmisionEntity, ad=>ad.shiftChanges)
    @JoinColumn({name:'id_admision'})
    admision:AdmisionEntity;

    @ManyToOne(()=>UserEntity, ad=>ad.shiftChanges)
    @JoinColumn({name:'id_user'})
    user:UserEntity;

    @OneToOne(()=>AdmisionHistoryEntity, ah=>ah.doctorShiftChange)
    @JoinColumn({name:'id_doctor_change'})
    doctorShiftChange:AdmisionHistoryEntity;

    @OneToOne(()=>AdmisionHistoryEntity, ah=>ah.nurseShiftChange)
    @JoinColumn({name:'id_nurse_change'})
    nurseShiftChange:AdmisionHistoryEntity;
}