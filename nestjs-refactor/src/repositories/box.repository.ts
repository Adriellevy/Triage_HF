import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BoxFilters, BoxInputDTO } from "src/domain/box.domain";
import { BoxEntity } from "src/entities/box.entity";
import { FindOptionsWhere, Repository } from "typeorm";

@Injectable()
export class BoxRepository{
    constructor(
        @InjectRepository(BoxEntity)
        private readonly boxRepository: Repository<BoxEntity>
    ){}

    async findAll(filters:BoxFilters):Promise<BoxEntity[]>{
        const where:FindOptionsWhere<BoxEntity> = {};
        if(filters.status) where.status = filters.status;
        if(filters.type) where.type = filters.type;

        return this.boxRepository.find({where});
    }

    async findById(id:number):Promise<BoxEntity | null>{
        return await this.boxRepository.findOne({
            where:{id}
        });
    }

    async create(body:BoxInputDTO):Promise<BoxEntity>{
        const box = new BoxEntity();
        box.code = body.code;
        box.type = body.type;
        box.status = body.status;
        box.time = body.time;

        return this.boxRepository.save(box);
    }

    async update(body:BoxInputDTO,entity:BoxEntity):Promise<void>{
        entity.code = body.code ?? entity.code;
        entity.type = body.type ?? entity.type;
        entity.status = body.status ?? entity.status;
        entity.time = body.time ?? entity.time;

        await this.boxRepository.save(entity);
    }

    async delete(id:number):Promise<void>{
        await this.boxRepository.delete(id);
    }
}