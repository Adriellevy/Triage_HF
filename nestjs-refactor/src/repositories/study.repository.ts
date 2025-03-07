import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { StudyInputDTO } from "src/domain/study.domain";
import { StudyEntity } from "src/entities/study.entity";
import { FindOptionsWhere, IsNull, Repository } from "typeorm";

@Injectable()
export class StudyRepository{
    constructor(
        @InjectRepository(StudyEntity)
        private readonly studyRepository:Repository<StudyEntity>
    ){}

    async getAllStudies(deleted?: boolean): Promise<StudyEntity[]> {
        const where:FindOptionsWhere<StudyEntity> = {};

        if (!deleted) {
            where.deleted = IsNull();
        }

        return await this.studyRepository.find({ where });
    }

    async findById(id:number):Promise<StudyEntity | null>{
        return await this.studyRepository.findOne({where:{id,deleted:IsNull()}});
    }

    async findByName(name:string):Promise<StudyEntity | null>{
        return await this.studyRepository.findOne({where:{name,deleted:IsNull()}});
    }

    async create(s:StudyInputDTO):Promise<StudyEntity>{
        const entity = new StudyEntity();
        entity.name = s.name;
        return await this.studyRepository.save(entity);
    }

    async update(entity:StudyEntity,s:StudyInputDTO):Promise<void>{
        entity.name = s.name;
        await this.studyRepository.save(entity);
    }

    async softDelete(ent:StudyEntity):Promise<void>{
        ent.deleted = new Date();
        await this.studyRepository.save(ent);
    }
}