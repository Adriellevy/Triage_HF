import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { SymptomInputDTO, SymptomOutputDTO } from 'src/domain/symptom.domain';
import { SymptomRepository } from 'src/repositories/symptom.repository';

@Injectable()
export class SymptomService {
    constructor(
        private readonly symptomRepository: SymptomRepository
    ){}

    async getAll(deleted?:boolean):Promise<SymptomOutputDTO[]>{
        try{
            const symptoms = await this.symptomRepository.getAll(deleted);
            return symptoms.map(symptom => new SymptomOutputDTO(symptom));
        }catch(error){
            throw new HttpException(error.message, error.status || 500);
        }
    }

    async getById(id:number):Promise<SymptomOutputDTO>{
        try{
            const symptom = await this.symptomRepository.findById(id);
            if(!symptom) throw new NotFoundException(`Sintoma con id '${id}' no encontrado`);
            return new SymptomOutputDTO(symptom);
        }catch(error){
            throw new HttpException(error.message, error.status || 500);
        }
    }

    async create(symptom:SymptomInputDTO):Promise<SymptomOutputDTO>{
        try{
            const existSymptom = await this.symptomRepository.findByName(symptom.name);
            if(existSymptom) throw new BadRequestException(`Ya existe un sintoma con el nombre '${symptom.name}'`);
            const newSymptom = await this.symptomRepository.create(symptom);
            return new SymptomOutputDTO(newSymptom);
        }catch(error){
            throw new HttpException(error.message, error.status || 500);
        }
    }

    async update(id:number,symptom:SymptomInputDTO):Promise<SymptomOutputDTO>{
        try{
            const symptomToUpdate = await this.symptomRepository.findById(id);
            if(!symptomToUpdate) throw new NotFoundException(`Sintoma con id '${id}' no encontrado`);
            const existSymptom = await this.symptomRepository.findByName(symptom.name);
            if(existSymptom && existSymptom.id !== id) throw new BadRequestException(`Ya existe un sintoma con el nombre '${symptom.name}'`);
            
            await this.symptomRepository.update(symptomToUpdate,symptom);
            return new SymptomOutputDTO(symptomToUpdate);
        }catch(error){
            throw new HttpException(error.message, error.status || 500);
        }
    }

    async delete(id:number):Promise<SymptomOutputDTO>{
        try{
            const symptom = await this.symptomRepository.findById(id);
            if(!symptom) throw new NotFoundException(`Sintoma con id '${id}' no encontrado`);
            await this.symptomRepository.softDelete(symptom);
            return new SymptomOutputDTO(symptom);
        }catch(error){
            throw new HttpException(error.message, error.status || 500);
        }
    }
}
