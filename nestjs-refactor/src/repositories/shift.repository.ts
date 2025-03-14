import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ShiftEntity } from "src/entities/shift.entity";
import { FindOptionsWhere, LessThan, LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm";

@Injectable()
export class ShiftRepository{
    constructor(
        @InjectRepository(ShiftEntity)
        private readonly shiftRepository: Repository<ShiftEntity>
    ){}

    async findByOptions(options:FindOptionsWhere<ShiftEntity>):Promise<ShiftEntity[] | null>{
        return this.shiftRepository.find({where:options});
    }

    async findOneByOptions(options:FindOptionsWhere<ShiftEntity>):Promise<ShiftEntity | null>{
        return this.shiftRepository.findOne({where:options});
    }

    async findCurrentShift(day:Date,hora:number):Promise<ShiftEntity | null>{
        return this.shiftRepository.findOne({
            where:{
                day:day.toISOString().split('T')[0],
                start_hour:MoreThanOrEqual(hora),
                end_hour:LessThanOrEqual(hora)
            }
        });
    }

    async create(date:Date,start:number,end:number):Promise<ShiftEntity>{
        const shift = new ShiftEntity();
        shift.day = date.toISOString().split('T')[0];
        shift.start_hour = start;
        shift.end_hour = end;
        shift.created_at = new Date();
        return this.shiftRepository.save(shift);
    }
}