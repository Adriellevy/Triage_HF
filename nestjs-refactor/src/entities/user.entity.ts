import { Role } from "src/domain/role.domain";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { TokenEntity } from "./token.entity";
import { AdmisionEntity } from "./admision.entity";
import { ShiftEntity } from "./shift.entity";
import { ShiftChangeEntity } from "./shift-change.entity";
import { AdmisionHistoryEntity } from "./admision-history.entity";
import { AdmisionDoctorProcedureEntity } from "./admision-doctor-procedure.entity";
import { AdmisionSymptomEntity } from "./admision-symptom.entity";

@Entity('user')
export class UserEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    email: string;

    @Column()
    fullname:string;

    @Column({nullable: true})
    speciality: string;

    @Column({type: 'enum', enum: Role, default: Role.DOCTOR})
    role: string;

    @OneToOne(()=>TokenEntity,t=>t.user)
    token: TokenEntity;

    @OneToMany(()=>AdmisionEntity,admision => admision.doctor)
    admisionsAsDoctor: AdmisionEntity[];

    @OneToMany(()=>AdmisionEntity,admision => admision.nurse)
    admisionsAsNurse: AdmisionEntity[];

    @OneToMany(()=>ShiftEntity,shift => shift.user)
    shifts: ShiftEntity[];

    @OneToMany(()=>ShiftChangeEntity,shiftChange => shiftChange.user)
    shiftChanges: ShiftChangeEntity[];

    @OneToMany(()=>AdmisionHistoryEntity,ah => ah.user)
    admisionHistories: AdmisionHistoryEntity[];

    @OneToMany(()=>AdmisionDoctorProcedureEntity,ah => ah.user)
    admisionDoctorProcedures: AdmisionDoctorProcedureEntity[];

    @OneToMany(()=>AdmisionDoctorProcedureEntity,ah => ah.doctor)
    admisionDoctorProceduresAsDoctor: AdmisionDoctorProcedureEntity[];

    @OneToMany(()=>AdmisionSymptomEntity,as => as.user)
    admisionSymptoms: AdmisionSymptomEntity[];
}