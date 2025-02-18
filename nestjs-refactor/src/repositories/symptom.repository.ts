import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SymptomEntity } from "src/entities/symptom.entity";
import { Repository } from "typeorm";

@Injectable()
export class SymptomRepository{
    constructor(
        @InjectRepository(SymptomEntity)
        private readonly symptomRepository:Repository<SymptomRepository>
    ){}
} 