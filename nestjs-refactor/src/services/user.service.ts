import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { Role } from 'src/domain/role.domain';
import { UserByTokenInputDTO, UserInputDTO, UserOutputDTO, UserUpdateDTO } from 'src/domain/user.domain';
import { UserRepository } from 'src/repositories/user.repository';
import { AuthService } from './auth.service';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly authService: AuthService
    ){}

    async findAll(role?: Role):Promise<UserOutputDTO[]> {
        try{
            return await this.userRepository.getAll(role);
        }catch(err){
            throw new HttpException(err.message,500);
        }
    }

    async findOne(id: string): Promise<UserOutputDTO> {
        try{
            const user = await this.userRepository.findOneById(id);
            if(!user)
                throw new NotFoundException(`Usuario con id ${id} no encontrado`);
            return new UserOutputDTO(user);
            
        }catch(err){
            throw new HttpException(err.message,err.status | 500);
        }
    }

    async findByToken(body:UserByTokenInputDTO): Promise<UserOutputDTO> {
        try{
            const token = this.authService.getSubOfToken(body.token);
            if(!token.sub)
                throw new BadRequestException('El token no es válido');
            const user = await this.userRepository.findOneById(token.sub);
            if(!user)
                throw new NotFoundException('Usuario no encontrado');
            return new UserOutputDTO(user);
        }catch(err){
            throw new HttpException(err.message,err.status | 500);
        }
    }

    async create(body:UserInputDTO):Promise<UserOutputDTO>{
        try{
            let user = await this.userRepository.findByUsername(body.username);
            if(user)
                throw new BadRequestException('El nombre de usuario ya existe');

            user = await this.userRepository.findByEmail(body.email);
            if(user)
                throw new BadRequestException('El email ya está registrado');

            const passwordHashed = await this.authService.hashPassword(body.password);
            const newUser = await this.userRepository.create(body, passwordHashed);
            return new UserOutputDTO(newUser);
        }catch(err){
            throw new HttpException(err.message,err.status | 500);
        }
    }

    async update(id:string,body:UserUpdateDTO):Promise<UserOutputDTO>{
        try{
            const userToUpdate = await this.userRepository.findOneById(id);
            if(!userToUpdate)
                throw new NotFoundException(`Usuario con id ${id} no encontrado`);
            
            if(body.username){
                let user = await this.userRepository.findByUsername(body.username);
                if(user && user.id !== id)
                    throw new BadRequestException('El nombre de usuario ya existe');
                userToUpdate.username = body.username;
            }
            if(body.speciality)
                userToUpdate.speciality = body.speciality;
            if(body.role)
                userToUpdate.role = body.role;
            if(body.fullname)
                userToUpdate.fullname = body.fullname;
            if(body.password)
                userToUpdate.password = await this.authService.hashPassword(body.password);
            if(body.email){
                let user = await this.userRepository.findByEmail(body.email);
                if(user && user.id !== id)
                    throw new BadRequestException('El email ya está registrado');
                userToUpdate.email = body.email;
            }

            await this.userRepository.update(userToUpdate);
            return new UserOutputDTO(userToUpdate);
        }catch(err){
            throw new HttpException(err.message,err.status | 500);
        }
    }

    async remove(id:string):Promise<UserOutputDTO>{
        try{
            const user = await this.userRepository.findOneById(id);
            if(!user)
                throw new NotFoundException(`Usuario con id ${id} no encontrado`);
            await this.userRepository.remove(user);
            return new UserOutputDTO(user);
        }catch(err){
            throw new HttpException(err.message,err.status | 500);
        }
    }
}
