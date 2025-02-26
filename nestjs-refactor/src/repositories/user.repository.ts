import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "src/domain/role.domain";
import { UserEntity } from "src/entities/user.entity";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserRepository{
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository:Repository<UserEntity>
    ) {
        this.initialize();
    }

    private async initialize() {
        if ((await this.getAll()).length === 0) {
            const passwordHashed = await bcrypt.hash('password123', 10);
            await this.create('Dr. Smith', Role.DOCTOR, passwordHashed,'mail@gmail.com')
            await this.create('Nurse Brown', Role.NURSE, passwordHashed,'mail@gmail.com')
            await this.create('Hospital Admin', Role.HOSPITAL_ADMIN, passwordHashed,'mail@gmail.com')
        }
    }

    async getAll(): Promise<UserEntity[]>{
        return await this.userRepository.find();
    }
    async findByUsername(username: string): Promise<UserEntity | null>{
        return await this.userRepository.findOne({
            where : {username}
        });
    }

    async findOneById(id: string): Promise<UserEntity | null>{
        return await this.userRepository.findOne({where:{id}});
    }

    async create(username: string, role: Role, password: string, email: string): Promise<UserEntity>{
        const user = new UserEntity();
        user.username = username;
        user.role = role;
        user.password = password;
        user.email = email;
        user.fullname = username;
        return await this.userRepository.save(user);
    }
}