import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity('token')
export class TokenEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({length:512,type:'varchar'})
    refresh_token:string;

    @Column({type:'timestamp'})
    issued_at: Date;

    @Column({nullable:true,length:512,type:'varchar'})
    expired_access_token?: string;
    
    @Column()
    id_user: string;

    @OneToOne(()=>UserEntity, u=>u.token)
    @JoinColumn({name:'id_user'})
    user: UserEntity;
}