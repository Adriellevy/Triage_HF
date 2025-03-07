import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TriageInputDTO } from "src/domain/triage.domain";
import { TriageEntity } from "src/entities/triage.entity";
import { FindOptionsOrderValue, Repository } from "typeorm";


@Injectable()
export class TriageRepository {
    constructor(
        @InjectRepository(TriageEntity)
        private readonly triageRepository: Repository<TriageEntity>
    ) {}

    async findAll():Promise<TriageEntity[]>{
        return await this.triageRepository.find();
    }
    async findOrderByID(order:FindOptionsOrderValue):Promise<TriageEntity[]>{
        return await this.triageRepository.find(
            {
                order: {
                    id: order
                }
            }
        );
    }
    async findByLevel(level:string):Promise<TriageEntity | null>{
        return await this.triageRepository.findOne({where:{level}});
    }
    async create(body: TriageInputDTO):Promise<TriageEntity>{
        const triage = new TriageEntity();
        triage.level = body.level;
        triage.color = body.color;
        return await this.triageRepository.save(triage);
    }

    async update(triageToUpdate: TriageEntity, body: TriageInputDTO) {
        triageToUpdate.level = body.level;
        triageToUpdate.color = body.color;
        await this.triageRepository.save(triageToUpdate);
    }

    async delete(ent:TriageEntity):Promise<TriageEntity>{
        return await this.triageRepository.remove(ent);
    }
}