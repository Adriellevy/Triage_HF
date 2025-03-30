import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { ShiftChangeInputDTO, ShiftChangeOutput } from 'src/domain/shift.domain';
import { ShiftChangeEntity } from 'src/entities/shift-change.entity';
import { environment } from 'src/environment';
import { ValidatorHelper } from 'src/helpers/validator.helper';
import { AdmisionHistoryRepository } from 'src/repositories/admision-history.repository';
import { AdmisionRepository } from 'src/repositories/admision.repository';
import { ShiftChangeRepository } from 'src/repositories/shift-change.repository';
import { ShiftRepository } from 'src/repositories/shift.repository';
import { UserRepository } from 'src/repositories/user.repository';
import { FindOptionsWhere, In, LessThan, MoreThan, MoreThanOrEqual } from 'typeorm';

@Injectable()
export class ShiftChangeService {
    constructor(
        private readonly shiftChangeRepository: ShiftChangeRepository,
        private readonly shiftRepository: ShiftRepository,
        private readonly admisionRepository: AdmisionRepository,
        private readonly userRepository: UserRepository,
        private readonly validatorHelper:ValidatorHelper,
        private readonly admisionHistoryRepository:AdmisionHistoryRepository
    ){}

    async getAll(date?:Date,shift?:number,admision?:number):Promise<ShiftChangeOutput[]>{
        try{
            const whereOptions:FindOptionsWhere<ShiftChangeEntity> = {};
            if(shift) whereOptions.id_shift = shift;
            if(admision) whereOptions.id_admision = admision;
            if(date){
                const shifts = await this.shiftRepository.findByOptions({day:date.toISOString().split('T')[0]});
                if(!shifts?.length) return [];
                whereOptions.id_shift = In(shifts.map(s=>s.id));
            }
            const result = await this.shiftChangeRepository.findByOptions(whereOptions);
            return result ? result.map(r=>new ShiftChangeOutput(r)) : [];
        }catch(err){
            throw new HttpException(err.message,err.status || 500);
        }
    }

    async create(data:ShiftChangeInputDTO[],req:any){
        try{
            const userID = req.user.id ? req.user.id : req.user.sub;
            
            const now = new Date();
            const shiftStart = now.getHours();
            const shiftEnd = (shiftStart + environment.shift_duration) % 24; 
            //Se le resta y suma 1 para tener un margen de error de 1 hora y no quedar afuera por minutos
            let shift = await this.shiftRepository.findOneByOptions({day:now.toISOString().split('T')[0],start_hour:MoreThan(now.getHours() - 1),end_hour:LessThan(now.getHours() + 1)});
            if(!shift){
                shift = await this.shiftRepository.create(now,shiftStart,shiftEnd,userID);
            }

            const allAdmisions = await this.admisionRepository.findByOptions({id:In(data.map(d=>d.id_admision))});
            const shiftChangesToResponse:ShiftChangeEntity[] = [];
            for(const sc of data){
                const currentAdmision = allAdmisions.find(a=>a.id === sc.id_admision);
                if(!currentAdmision) throw new BadRequestException(`Admision ${sc.id_admision} not found`);


                const shiftChange = new ShiftChangeEntity();
                shiftChange.id_shift = shift.id;
                shiftChange.id_user = userID;
                shiftChange.id_admision = currentAdmision.id;
                shiftChange.patient_observations = sc.observations;
                shiftChange.patient_records = sc.records;
                shiftChange.created_at = new Date();

                if(currentAdmision.id_doctor !== sc.id_new_doctor){
                    if(!this.validatorHelper.validateUUID(sc.id_new_doctor)) throw new BadRequestException(`La admision con id_admision: ${sc.id_admision} 
                        tiene un mal formato en el uuid del doctor: ${sc.id_new_doctor}`);
                        const doctor = await this.userRepository.findOneById(sc.id_new_doctor);
                        if(!doctor) throw new NotFoundException(`El doctor con id: ${sc.id_new_doctor} no existe`);
                    const doctorHistory = await this.admisionHistoryRepository.create(currentAdmision,userID,'id_doctor',currentAdmision.id_doctor,sc.id_new_doctor);
                    shiftChange.id_doctor_change = doctorHistory.id;
                    currentAdmision.id_doctor = sc.id_new_doctor;
                    currentAdmision.doctor = doctor;
                }

                if(currentAdmision.id_nurse !== sc.id_new_nurse){
                    if(!this.validatorHelper.validateUUID(sc.id_new_nurse)) throw new BadRequestException(`La admision con id_admision: ${sc.id_admision} 
                        tiene un mal formato en el uuid del enfermero: ${sc.id_new_doctor}`);
                    const nurse = await this.userRepository.findOneById(sc.id_new_doctor);
                    if(!nurse) throw new NotFoundException(`El enfermero con id: ${sc.id_new_doctor} no existe`);
                    
                    const nurseHistory = await this.admisionHistoryRepository.create(currentAdmision,userID,'id_nurse',currentAdmision.id_nurse,sc.id_new_nurse);
                    shiftChange.id_nurse_change = nurseHistory.id;
                    currentAdmision.id_nurse = sc.id_new_nurse;
                    currentAdmision.nurse = nurse;
                }

                shiftChangesToResponse.push(await this.shiftChangeRepository.create(shiftChange));
            }

            return shiftChangesToResponse.map(s=> new ShiftChangeOutput(s));
        }catch(err){
            throw new HttpException(err.message,err.status || 500);
        }
    }
}
