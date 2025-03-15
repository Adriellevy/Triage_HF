import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AdmisionInputDTO } from "src/domain/admision.domain";
import { AdmisionEntity } from "src/entities/admision.entity";
import { FindOptionsWhere, Repository } from "typeorm";

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

    async findAll():Promise<AdmisionEntity[]>{
        return await this.admisionRepository.find();
    }

    async findByOptions(options:FindOptionsWhere<AdmisionEntity>):Promise<AdmisionEntity[]>{
        return await this.admisionRepository.find({where:options}) || [];
    }

    async createAdmision(data:AdmisionInputDTO){
        const admision = new AdmisionEntity()

        admision.id_patient = data.id_patient;
        admision.id_doctor = data.id_doctor;
        admision.id_nurse = data.id_nurse;
        admision.id_box = data.id_box;
        admision.entry_time = data.entry_time;
        admision.nurse_comment = data.nurse_comment ? data.nurse_comment : null;
        admision.warning = data.warning ? data.warning : null;

        return await this.admisionRepository.save(admision);
    }

    async updateAdmision(adm:AdmisionEntity){
        await this.admisionRepository.save(adm);
    }
}