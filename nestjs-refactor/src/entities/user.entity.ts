import { Role } from "src/domain/role.domain";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { TokenEntity } from "./token.entity";
import { AdmisionEntity } from "./admision.entity";

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
}