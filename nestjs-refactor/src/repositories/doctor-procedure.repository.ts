import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DoctorProcedureInputDTO } from "src/domain/doctor-procedure.domain";
import { DoctorProcedureEntity } from "src/entities/doctor-procedure.entity";
import { FindOptionsWhere, IsNull, Repository } from "typeorm";

@Injectable()
export class DoctorProcedureRepository {
    constructor(
        @InjectRepository(DoctorProcedureEntity)
        private readonly doctorProcedureRepository: Repository<DoctorProcedureEntity>
    ){}


    async findAll(include_deleted?:boolean):Promise<DoctorProcedureEntity[]>{
        const where: FindOptionsWhere<DoctorProcedureEntity> = {}
        if(!include_deleted ){
            where.deleted = IsNull();
        }

        return await this.doctorProcedureRepository.find({where});
    }

    async findById(id:number):Promise<DoctorProcedureEntity | null>{
        return await this.doctorProcedureRepository.findOne({
            where:{id,deleted:IsNull()}
        });
    }

    async findByName(name:string):Promise<DoctorProcedureEntity | null>{
        return await this.doctorProcedureRepository.findOne({
            where:{name,deleted:IsNull()}
        });
    }

    async create(body:DoctorProcedureInputDTO):Promise<DoctorProcedureEntity>{
        const ent = new DoctorProcedureEntity();
        ent.name = body.name;
        return await this.doctorProcedureRepository.save(ent);
    }

    async update(dp:DoctorProcedureEntity,body:DoctorProcedureInputDTO):Promise<DoctorProcedureEntity>{
        dp.name = body.name;
        return await this.doctorProcedureRepository.save(dp);
    }

    async softDelete(dp:DoctorProcedureEntity):Promise<DoctorProcedureEntity>{
        dp.deleted = new Date();
        return await this.doctorProcedureRepository.save(dp);
    }
}