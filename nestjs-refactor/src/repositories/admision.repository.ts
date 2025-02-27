import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AdmisionEntity } from "src/entities/admision.entity";
import { Repository } from "typeorm";

@Injectable()
export class AdmisionRepository{
    constructor(
        @InjectRepository(AdmisionEntity)
        private readonly admisionRepository: Repository<AdmisionEntity>
    ){}

    async findById(id:number):Promise<AdmisionEntity | null>{
        return await this.admisionRepository.findOne({
            where:{id}
        });
    }
}