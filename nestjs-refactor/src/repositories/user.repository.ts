import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "src/domain/role.domain";
import { UserEntity } from "src/entities/user.entity";
import { FindOptionsWhere, Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { UserInputDTO } from "src/domain/user.domain";
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
            await this.createInit('Dr. Smith', Role.DOCTOR, passwordHashed,'mail@gmail.com')
            await this.createInit('Nurse Brown', Role.NURSE, passwordHashed,'mail@gmail.com')
            await this.createInit('Hospital Admin', Role.HOSPITAL_ADMIN, passwordHashed,'mail@gmail.com')
        }
    }

    async getAll(role?:Role): Promise<UserEntity[]>{
        const where:FindOptionsWhere<UserEntity> = {};
        if(role){
            where.role = role;
        }
        return await this.userRepository.find({where});
    }
    async findByUsername(username: string): Promise<UserEntity | null>{
        return await this.userRepository.findOne({
            where : {username}
        });
    }


    async findByEmail(email: string): Promise<UserEntity | null>{
        return await this.userRepository.findOne({where:{email}});
    }

    async findOneById(id: string): Promise<UserEntity | null>{
        return await this.userRepository.findOne({where:{id}});
    }

    async createInit(username: string, role: Role, password: string, email: string): Promise<UserEntity>{
        const user = new UserEntity();
        user.username = username;
        user.role = role;
        user.password = password;
        user.email = email;
        user.fullname = username;
        return await this.userRepository.save(user);
    }

    async create(body:UserInputDTO, password: string): Promise<UserEntity>{
        const user = new UserEntity();
        user.username = body.username;
        user.role = body.role;
        user.password = password;
        user.email = body.email;
        user.fullname = body.fullname;
        user.speciality = body.speciality;
        return await this.userRepository.save(user);
    }

    async update(entity:UserEntity): Promise<UserEntity>{
        return await this.userRepository.save(entity);
    }

    async remove(entity:UserEntity): Promise<UserEntity>{
        return await this.userRepository.remove(entity);
    }
}