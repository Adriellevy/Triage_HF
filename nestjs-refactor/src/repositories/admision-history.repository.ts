import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AdmisionHistoryEntity } from "src/entities/admision-history.entity";
import { AdmisionEntity } from "src/entities/admision.entity";
import { Repository } from "typeorm";

@Injectable()
export class AdmisionHistoryRepository{
    constructor(
        @InjectRepository(AdmisionHistoryEntity)
        private readonly admisionHistoryRepository: Repository<AdmisionHistoryEntity>
    ){}

    async create(adm:AdmisionEntity, id_user:string, column_updated:string, old_value:string, new_value:string){
        const admHistory = new AdmisionHistoryEntity();
        admHistory.id_admision = adm.id;
        admHistory.id_user = id_user;
        admHistory.column_updated = column_updated;
        admHistory.old_value = old_value;
        admHistory.new_value = new_value;
        admHistory.created_at = new Date();
        return await this.admisionHistoryRepository.save(admHistory);
    }
}