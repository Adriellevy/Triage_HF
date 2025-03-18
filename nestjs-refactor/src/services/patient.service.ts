import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PatientInputDTO, PatientOutputDTO, PatientUpdateDTO } from 'src/domain/patient.domain';
import { ValidatorHelper } from 'src/helpers/validator.helper';
import { PatientRepository } from 'src/repositories/patient.repository';

@Injectable()
export class PatientService {
    constructor(
        private readonly patientRepository: PatientRepository,
        private readonly validatorHelper:ValidatorHelper
    ){}

    async getAllPatients(page?:number, limit?:number):Promise<PatientOutputDTO[]>{
        return (await this.patientRepository.getAllPatients(page,limit)).map(p=> new PatientOutputDTO(p));
    }

    async getPatientById(id:string):Promise<PatientOutputDTO>{
        try{
            if(!this.validatorHelper.validateUUID(id)){
                throw new BadRequestException(`El id ${id} tiene un formato invalido`);
            }
            const patient = await this.patientRepository.getPatientById(id);
            if(!patient){
                throw new NotFoundException(`Paciente con id ${id} no encontrado`);
            }
            return new PatientOutputDTO(patient);
        }catch(e){
            throw new HttpException(e.message,e.status | 500);
        }
    }

    async createPatient(body:PatientInputDTO):Promise<PatientOutputDTO>{
        try{
            const patient = await this.patientRepository.findByOptions({
                document_type:body.document_type,
                document_number:body.document_number
            })
            if(patient)
                throw new BadRequestException(`Ya existe paciente con TIPO_DOCUMENTO: ${body.document_type} y NUMERO_DOCUMENTO: ${body.document_number}`)
            const ent = await this.patientRepository.createPatient(body)
            return new PatientOutputDTO(ent);
        }catch(e){
            throw new HttpException(e.message,e.status | 500);
        }
    }

    async updatePatient(id:string,body:PatientUpdateDTO){
        try{
            if(!this.validatorHelper.validateUUID(id))
                throw new BadRequestException(`El id ${id} tiene un formato invalido`);

            const patientToUpdate = await this.patientRepository.getPatientById(id);
            if(!patientToUpdate)
                throw new NotFoundException(`Paciente con id ${id} no encontrado`);
        
            if(body.document_type && !body.document_number){
                throw new BadRequestException(`El numero de documento es requerido`);
            }
            if(!body.document_type && body.document_number){
                throw new BadRequestException(`El tipo de documento es requerido`);
            }
            if(body.document_type && body.document_number){
                if(body.document_type != patientToUpdate.document_type || body.document_number != patientToUpdate.document_number){
                    const patientWithNewDocument = await this.patientRepository.findByOptions({document_type:body.document_type,document_number:body.document_number});
                    if(patientWithNewDocument)
                        throw new BadRequestException(`Ya existe un paciente con el documento ${body.document_type} ${body.document_number}`);
                }
            }

            if(body.document_type)
                patientToUpdate.document_type = body.document_type;
            if(body.document_number)
                patientToUpdate.document_number = body.document_number;
            if(body.fullname)
                patientToUpdate.fullname = body.fullname;
            if(body.birthdate)
                patientToUpdate.birthdate = body.birthdate;

            await this.patientRepository.update(patientToUpdate);
            return new PatientOutputDTO(patientToUpdate);
            
        }catch(err){
            throw new HttpException(err.message,err.status || 500);
        }
    }
}
