import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { DoctorProcedureInputDTO, DoctorProcedureOutputDTO } from 'src/domain/doctor-procedure.domain';
import { DoctorProcedureRepository } from 'src/repositories/doctor-procedure.repository';

@Injectable()
export class DoctorProcedureService {
    constructor(private readonly doctorProcedureRepository: DoctorProcedureRepository) {}

    async getAll(include_deleted?: boolean):Promise<DoctorProcedureOutputDTO[]> {
        try{
            return (await this.doctorProcedureRepository.findAll(include_deleted)).map(dp => new DoctorProcedureOutputDTO(dp));
        }catch(e){
            throw new HttpException(e.message,e.status || 500);
        }
    }

    async getById(id: number):Promise<DoctorProcedureOutputDTO> {
        try{
            const dp = await this.doctorProcedureRepository.findById(id);
            if(!dp)
                throw new NotFoundException(`Doctor Procedure with id ${id} not found`);
            return new DoctorProcedureOutputDTO(dp);
        }catch(err){
            throw new HttpException(err.message,err.status || 500);
        }
    }

    async create(body: DoctorProcedureInputDTO):Promise<DoctorProcedureOutputDTO> {
        try{
            const dp = await this.doctorProcedureRepository.findByName(body.name);
            if(dp)
                throw new NotFoundException(`Procedimiento de doctor con nombre ${body.name} ya existe`);
            return new DoctorProcedureOutputDTO(await this.doctorProcedureRepository.create(body));
        }catch(err){
            throw new HttpException(err.message,err.status || 500);
        }
    }

    async update(id: number, body: DoctorProcedureInputDTO):Promise<DoctorProcedureOutputDTO> {
        try{
            const dpToUpdate = await this.doctorProcedureRepository.findById(id);
            if(!dpToUpdate)
                throw new NotFoundException(`Doctor Procedure with id ${id} not found`);
            
            const dp = await this.doctorProcedureRepository.findByName(body.name);

            if(dp && dp.id !== id)
                throw new NotFoundException(`Procedimiento de doctor con nombre ${body.name} ya existe`);

            await this.doctorProcedureRepository.update(dpToUpdate,body);
            return new DoctorProcedureOutputDTO(dpToUpdate);
        }catch(err){
            throw new HttpException(err.message,err.status || 500);
        }
    }

    async delete(id: number):Promise<DoctorProcedureOutputDTO> {
        try{
            const dp = await this.doctorProcedureRepository.findById(id);
            if(!dp)
                throw new NotFoundException(`Doctor Procedure with id ${id} not found`);
            await this.doctorProcedureRepository.softDelete(dp);
            return new DoctorProcedureOutputDTO(dp);
        }catch(err){
            throw new HttpException(err.message,err.status || 500);
        }
    }
}
