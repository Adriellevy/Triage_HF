import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { AdmisionInputDTO, AdmisionOutputDTO, AdmisionUpdateDTO } from 'src/domain/admision.domain';
import { ValidatorHelper } from 'src/helpers/validator.helper';
import { AdmisionHistoryRepository } from 'src/repositories/admision-history.repository';
import { AdmisionRepository } from 'src/repositories/admision.repository';
import { BoxRepository } from 'src/repositories/box.repository';
import { PatientRepository } from 'src/repositories/patient.repository';
import { UserRepository } from 'src/repositories/user.repository';

@Injectable()
export class AdmisionService {

    constructor(
        private readonly admisionRepository: AdmisionRepository,
        private readonly patientRepository: PatientRepository,
        private readonly userRepository: UserRepository,
        private readonly boxRepository:BoxRepository,
        private readonly validatorHelper:ValidatorHelper,
        private readonly admisionHistoryRepository: AdmisionHistoryRepository
    ){}

    async getAdmisions() {
        return (await this.admisionRepository.findAll()).map(adm => new AdmisionOutputDTO(adm));
    }

    async getAdmisionById(id: number):Promise<AdmisionOutputDTO>{
        try{
            const adm = await this.admisionRepository.findById(id);
            if(!adm) throw new NotFoundException(`Admision con id ${id} no encontrada`);
            return new AdmisionOutputDTO(adm);
        }catch(err){
            throw new HttpException(err.message, err.status | 500);
        }
    }

    async createAdmision(body:AdmisionInputDTO):Promise<AdmisionOutputDTO>{
        try{
            if(!this.validatorHelper.validateUUID(body.id_patient)) throw new BadRequestException(`id_patient: ${body.id_patient} no es un UUID valido`);
            const patient = await this.patientRepository.getPatientById(body.id_patient);
            if(!patient) throw new NotFoundException(`Paciente con id ${body.id_patient} no encontrado`);
        
            if(!this.validatorHelper.validateUUID(body.id_doctor)) throw new BadRequestException(`id_doctor: ${body.id_doctor} no es un UUID valido`);
            const doctor = await this.userRepository.findOneById(body.id_doctor);
            if(!doctor) throw new NotFoundException(`Doctor con id ${body.id_doctor} no encontrado`);

            if(!this.validatorHelper.validateUUID(body.id_nurse)) throw new BadRequestException(`id_nurse: ${body.id_nurse} no es un UUID valido`);
            const nurse = await this.userRepository.findOneById(body.id_nurse);
            if(!nurse) throw new NotFoundException(`Enfermero con id ${body.id_nurse} no encontrado`);
        
            const box = await this.boxRepository.findById(body.id_box);
            if(!box) throw new NotFoundException(`Box con id ${body.id_box} no encontrado`);

            const ent = await this.admisionRepository.createAdmision(body);
            return new AdmisionOutputDTO(ent);
        }catch(err){
            throw new HttpException(err.message, err.status | 500);
        }
    }


    async updateAdmision(id:number,body:AdmisionUpdateDTO,req:any):Promise<AdmisionOutputDTO>{
        try{
            const admToUpdate = await this.admisionRepository.findById(id);
            if(!admToUpdate) throw new NotFoundException(`Admision con id ${id} no encontrada`);
            const admToDto = new AdmisionOutputDTO(admToUpdate);

            if(body.id_patient && body.id_patient != admToUpdate.id_patient){
                if(!this.validatorHelper.validateUUID(body.id_patient)) throw new BadRequestException(`id_patient: ${body.id_patient} no es un UUID valido`);
                const patient = await this.patientRepository.getPatientById(body.id_patient);
                if(!patient) throw new NotFoundException(`Paciente con id ${body.id_patient} no encontrado`);

                admToUpdate.id_patient = body.id_patient;
                await this.admisionHistoryRepository.create(admToUpdate,req.user.id,'id_patient',admToDto.id_patient,patient.id)
            }

            if(body.id_doctor && body.id_doctor != admToUpdate.id_doctor){
                if(!this.validatorHelper.validateUUID(body.id_doctor)) throw new BadRequestException(`id_doctor: ${body.id_doctor} no es un UUID valido`);
                const doctor = await this.userRepository.findOneById(body.id_doctor);
                if(!doctor) throw new NotFoundException(`Doctor con id ${body.id_doctor} no encontrado`);

                admToUpdate.id_doctor = body.id_doctor;
                await this.admisionHistoryRepository.create(admToUpdate,req.user.id,'id_doctor',admToDto.id_doctor,doctor.id)
            }

            if(body.id_nurse && body.id_nurse != admToUpdate.id_nurse){
                if(!this.validatorHelper.validateUUID(body.id_nurse)) throw new BadRequestException(`id_nurse: ${body.id_nurse} no es un UUID valido`);
                const nurse = await this.userRepository.findOneById(body.id_nurse);
                if(!nurse) throw new NotFoundException(`Enfermero con id ${body.id_nurse} no encontrado`);

                admToUpdate.id_nurse = body.id_nurse;
                await this.admisionHistoryRepository.create(admToUpdate,req.user.id,'id_nurse',admToDto.id_nurse,nurse.id)
            }

            if(body.id_box && body.id_box != admToUpdate.id_box){
                const box = await this.boxRepository.findById(body.id_box);
                if(!box) throw new NotFoundException(`Box con id ${body.id_box} no encontrado`);

                admToUpdate.id_box = body.id_box;
                await this.admisionHistoryRepository.create(admToUpdate,req.user.id,'id_box',admToDto.id_box.toString(),box.id.toString())
            }

            if(body.nurse_comment && body.nurse_comment != admToUpdate.nurse_comment){
                admToUpdate.nurse_comment = body.nurse_comment;
                await this.admisionHistoryRepository.create(admToUpdate,req.user.id,'nurse_comment',admToDto.nurse_comment ?? '',body.nurse_comment)
            }

            if(body.warning && body.warning != admToUpdate.warning){
                admToUpdate.warning = body.warning;
                await this.admisionHistoryRepository.create(admToUpdate,req.user.id,'warning',admToDto.warning ?? '',body.warning)
            }

            if(body.departure_time && body.departure_time != admToUpdate.departure_time){
                admToUpdate.departure_time = body.departure_time;
                await this.admisionHistoryRepository.create(admToUpdate,req.user.id,'departure_time',admToDto.departure_time.toString() ?? '',body.departure_time.toString())
            }
            
            await this.admisionRepository.updateAdmision(admToUpdate);
            return admToDto;
        }catch(err){
            throw new HttpException(err.message, err.status | 500);
        }   
    }
}
