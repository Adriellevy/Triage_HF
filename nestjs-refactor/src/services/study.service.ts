import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { StudyInputDTO, StudyOutputDTO } from 'src/domain/study.domain';
import { StudyRepository } from 'src/repositories/study.repository';

@Injectable()
export class StudyService {
    constructor(
        private readonly studyRepository: StudyRepository
    ){}

    async getAllStudies(deleted?:boolean):Promise<StudyOutputDTO[]>{
        return (await this.studyRepository.getAllStudies(deleted)).map(study => new StudyOutputDTO(study));
    }

    async getStudyById(id:number):Promise<StudyOutputDTO>{
        try{
            const study = await this.studyRepository.findById(id);
            if(!study) throw new NotFoundException(`Estudio con id '${id}' no encontrado`);
            return new StudyOutputDTO(study);
        }catch(error){
            throw new HttpException(error.message, error.status || 500);
        }
    }

    async createStudy(study:StudyInputDTO):Promise<StudyOutputDTO>{
        try{
            const studyToCreate = await this.studyRepository.findByName(study.name);
            if(studyToCreate) throw new NotFoundException(`Ya existe un estudio con el nombre '${study.name}'`);
            const newStudy = await this.studyRepository.create(study);
            return new StudyOutputDTO(newStudy);
        }catch(err){
            throw new HttpException(err.message, err.status || 500);
        }
    }

    async updateStudy(id:number,study:StudyInputDTO):Promise<StudyOutputDTO>{
        try{
            const studyToUpdate = await this.studyRepository.findById(id);
            if(!studyToUpdate) throw new NotFoundException(`Estudio con id '${id}' no encontrado`);
            const existStudy = await this.studyRepository.findByName(study.name);
            if(existStudy && existStudy.id !== id) throw new NotFoundException(`Ya existe un estudio con el nombre '${study.name}'`);
            
            await this.studyRepository.update(studyToUpdate,study);
            return new StudyOutputDTO(studyToUpdate);
        }catch(err){
            throw new HttpException(err.message, err.status || 500);
        }
    }

    async deleteStudy(id:number):Promise<StudyOutputDTO>{
        try{
            const study = await this.studyRepository.findById(id);
            if(!study) throw new NotFoundException(`Estudio con id '${id}' no encontrado`);
            await this.studyRepository.softDelete(study);
            return new StudyOutputDTO(study);
        }catch(err){
            throw new HttpException(err.message, err.status || 500);
        }
    }
}
