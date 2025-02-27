import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { BoxFilters, BoxInputDTO, BoxOutputDTO, BoxStatus } from 'src/domain/box.domain';
import { AdmisionEntity } from 'src/entities/admision.entity';
import { AdmisionRepository } from 'src/repositories/admision.repository';
import { BoxRepository } from 'src/repositories/box.repository';

@Injectable()
export class BoxService {
    constructor(
        private readonly boxRepository: BoxRepository,
        private readonly admisionRepository: AdmisionRepository
    ){}

    async getAll(filters:BoxFilters):Promise<BoxOutputDTO[]>{
        try{
            const boxs = await this.boxRepository.findAll(filters);

            return boxs.map(b => new BoxOutputDTO(b));
        }catch(err){
            throw new HttpException(err.message,err.status || 500);
        }
    }

    async getById(id:number):Promise<BoxOutputDTO>{
        try{
            const box = await this.boxRepository.findById(id);

            if(!box) throw new HttpException(`Box with id '${id}' not found`,404);

            return new BoxOutputDTO(box);
        }catch(err){
            throw new HttpException(err.message,err.status || 500);
        }
    }

    async create(body:BoxInputDTO):Promise<BoxOutputDTO>{
        try{
            const box = await this.boxRepository.create(body);
            
            return new BoxOutputDTO(box);
        }catch(err){
            throw new HttpException(err.message,err.status || 500);
        }
    }

    async update(id:number,body:BoxInputDTO):Promise<BoxOutputDTO>{
        try{
            
            const boxToUpdate = await this.boxRepository.findById(id);
            if(!boxToUpdate) throw new HttpException(`Box with id '${id}' not found`,404);
            
            await this.boxRepository.update(body,boxToUpdate);

            return new BoxOutputDTO(boxToUpdate);
        }catch(err){
            throw new HttpException(err.message,err.status || 500);
        }
    }

    async delete(id:number):Promise<BoxOutputDTO>{
        try{
            const boxToDelete = await this.boxRepository.findById(id);
            if(!boxToDelete) throw new NotFoundException(`Box with id '${id}' not found`);

            if(boxToDelete.admision) throw new BadRequestException(`Box with id '${id}' has an admision associated`);
            

            await this.boxRepository.delete(boxToDelete.id);

            return new BoxOutputDTO(boxToDelete);
        }catch(err){
            throw new HttpException(err.message,err.status || 500);
        }
    }
}
