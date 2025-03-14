import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { ShiftOutputDTO } from 'src/domain/shift.domain';
import { ShiftRepository } from 'src/repositories/shift.repository';

@Injectable()
export class ShiftService {
    constructor(private readonly shiftRepository: ShiftRepository){}

    async getCurrentShift():Promise<ShiftOutputDTO>{
        try{
            const now = new Date();
            const shift = await this.shiftRepository.findCurrentShift(now,now.getHours());
            if(!shift) throw new NotFoundException(`No existe un turno para el dia ${now.toDateString()} y la hora ${now.getHours()}`);

            return new ShiftOutputDTO(shift);
        }catch(err){
            throw new HttpException(err.message,err.status | 500);
        }
    }

    async getShiftById(id:number):Promise<ShiftOutputDTO>{
        try{
            const shift = await this.shiftRepository.findOneByOptions({id});
            if(!shift) throw new NotFoundException(`No se encontro el turno con id ${id}`);

            return new ShiftOutputDTO(shift[0]);
        }catch(err){
            throw new HttpException(err.message,err.status | 500);
        }
    }

    async getAllShifts(date?:Date):Promise<ShiftOutputDTO[]>{
        try{
            const shifts = await this.shiftRepository.findByOptions(date ? {day:date}:{})
            return shifts?.map(s=>new ShiftOutputDTO(s)) || [];
        }catch(err){
            throw new HttpException(err.message,err.status | 500);
        }
    }
}
