import { Role } from "src/domain/role.domain";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { TokenEntity } from "./token.entity";

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

    @Column({type: 'enum', enum: Role, default: Role.DOCTOR})
    role: string;

    @OneToOne(()=>TokenEntity,t=>t.user)
    token: TokenEntity;
}