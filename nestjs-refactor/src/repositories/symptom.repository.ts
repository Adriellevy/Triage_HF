import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SymptomInputDTO } from "src/domain/symptom.domain";
import { SymptomEntity } from "src/entities/symptom.entity";
import { FindOptionsWhere, IsNull, Not, Repository } from "typeorm";

@Injectable()
export class SymptomRepository{
    constructor(
        @InjectRepository(SymptomEntity)
        private readonly symptomRepository:Repository<SymptomEntity>
    ){}

    async getAll(deleted?: boolean): Promise<SymptomEntity[]> {
        const where: FindOptionsWhere<SymptomEntity> = {};
    
        if (!deleted) {
            where.deleted = IsNull(); 
        } 
    
        return await this.symptomRepository.find({ where });
    }
    

    async findById(id:number):Promise<SymptomEntity | null>{
        return await this.symptomRepository.findOne({where:{id,deleted:IsNull()}});
    }

    async findByName(name:string):Promise<SymptomEntity | null>{
        return await this.symptomRepository.findOne({where:{name,deleted:IsNull()}});
    }

    async create(s:SymptomInputDTO):Promise<SymptomEntity>{
        const entity = new SymptomEntity();
        entity.name = s.name;
        return await this.symptomRepository.save(entity);
    }

    async update(entity:SymptomEntity,s:SymptomInputDTO):Promise<void>{
        entity.name = s.name
        await this.symptomRepository.save(entity);
    }

    async softDelete(entity:SymptomEntity):Promise<void>{
        entity.deleted = new Date();
        await this.symptomRepository.save(entity);
    }
} 