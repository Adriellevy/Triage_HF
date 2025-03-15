import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PatientInputDTO } from "src/domain/patient.domain";
import { PatientEntity } from "src/entities/patient.entity";
import { FindOptionsOrder, FindOptionsWhere, Repository } from "typeorm";

@Injectable()
export class PatientRepository{
    constructor(
        @InjectRepository(PatientEntity)
        private readonly patientRepository: Repository<PatientEntity>
    ){}

    async getAllPatients(page?: number, limit?: number) {
        const options: any = {
            relations: {
                admisions: {
                    admisionStudies: true,
                    admisionSymptoms: true,
                    admisionDoctorProcedures: true
                }
            }
        };
    
        if (page !== undefined && limit !== undefined) {
            options.skip = (page - 1) * limit;
            options.take = limit;
        }
    
        return this.patientRepository.find(options);
    }

    async getPatientById(id: string) {
        return this.patientRepository.findOne({
            relations: {
                admisions: {
                    admisionStudies: true,
                    admisionSymptoms: true,
                    admisionDoctorProcedures: true
                }
            },
            where:{
                id
            }
        });
    }

    async createPatient(body:PatientInputDTO):Promise<PatientEntity>{
        const ent = new PatientEntity()
        ent.document_type = body.document_type;
        ent.document_number = body.document_number;
        ent.fullname = body.fullname;
        return this.patientRepository.save(ent);
    }

    async findByOptions(options:FindOptionsWhere<PatientEntity>){
        return this.patientRepository.findOne({where:options});
    }

    async update(patient:PatientEntity){
        return this.patientRepository.save(patient);
    }
}