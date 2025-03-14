import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ShiftChangeEntity } from "src/entities/shift-change.entity";
import { FindOptionsWhere, Repository } from "typeorm";

@Injectable()
export class ShiftChangeRepository{
    constructor(
        @InjectRepository(ShiftChangeEntity)
        private readonly shiftChangeRepository: Repository<ShiftChangeEntity>
    ){}

    async findByOptions(options:FindOptionsWhere<ShiftChangeEntity>):Promise<ShiftChangeEntity[] | null>{
        return this.shiftChangeRepository.find({where:options,relations:['nurseShiftChange','doctorShiftChange']});
    }

    async create(data:ShiftChangeEntity):Promise<ShiftChangeEntity>{
        return this.shiftChangeRepository.save(data);
    }
}