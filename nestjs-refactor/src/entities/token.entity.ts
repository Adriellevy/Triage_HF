import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity('token')
export class TokenEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    refresh_token:string;

    @Column({type:'timestamp'})
    issued_at: Date;

    @Column({nullable:true})
    expired_access_token?: string;
    
    @Column()
    user_id: string;

    @OneToOne(()=>UserEntity, u=>u.token)
    @JoinColumn({name:'user_id'})
    user: UserEntity;
}