import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { TriageInputDTO, TriageOutputDTO } from 'src/domain/triage.domain';
import { TriageRepository } from 'src/repositories/triage.repository';

@Injectable()
export class TriageService {
    constructor(
        private readonly triageRepository: TriageRepository
    ){}

    async getAllTriage():Promise<TriageOutputDTO[]>{
        return (await this.triageRepository.findAll()).map(t => new TriageOutputDTO(t));
    }

    async createTriage(body: TriageInputDTO):Promise<TriageOutputDTO>{
        try{
            if(!this.validateRgbColor(body.color))
                throw new BadRequestException(`${body.color} no es un color RGB válido`);    
            return new TriageOutputDTO(await this.triageRepository.create(body));
        }catch(e){
            throw new HttpException(e.message,e.status | 500);
        }
    }

    async updateTriage(body: TriageInputDTO, level: string):Promise<TriageOutputDTO>{
        try{
            const triageToUpdate = await this.triageRepository.findByLevel(level);
            if(!triageToUpdate)
                throw new BadRequestException(`No existe el nivel de triage ${level}`);
    
            const newTriage = await this.triageRepository.findByLevel(body.level);
            if(newTriage && newTriage.id !== triageToUpdate.id)
                throw new BadRequestException(`Ya existe un triage con el nivel ${body.level}`);
    
            this.validateRgbColor(body.color);
    
            await this.triageRepository.update(triageToUpdate,body)

            return new TriageOutputDTO(triageToUpdate)
        }catch(e){
            throw new HttpException(e.message,e.status | 500);
        }
    }
    
    private validateRgbColor(color: string) {
        const rgbRegex = /^(\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})$/;
        const [r, g, b] = color.split(',').map((c) => parseInt(c));
        return rgbRegex.test(color) && r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255;
    }

    async deleteTriage(level:string):Promise<TriageOutputDTO>{
        try{
            const triageToDelete = await this.triageRepository.findByLevel(level);

            if(!triageToDelete)
                throw new NotFoundException(`No existe el nivel de triage ${level}`);

            // const admissions = await this.admisionRepository.getAdmissionsByTriage(triageToDelete);
            // if(admissions.length > 0)
            //     throw new BadRequestException(`El triage ${level} tiene admisiones asociadas`);

            await this.triageRepository.delete(triageToDelete)

            return new TriageOutputDTO(triageToDelete);
        }catch(e){
            throw new HttpException(e.message,e.status | 500);
        }
    }

    async sortTriage(body: TriageInputDTO[]):Promise<TriageOutputDTO[]>{
        try{
            const triages = body
            const existingTriages = await this.triageRepository.findOrderByID('ASC');
            if(existingTriages.length !== triages.length)
                throw new BadRequestException('El número de triages recibidos no coincide con los existentes en la base de datos.');

            // Paso 1: Actualizar valores temporalmente (niveles cortos)
            for (let i = 0; i < existingTriages.length; i++) {
                const currentTriage = existingTriages[i];
                const tempLevel = `_${i + 1}`; // Valores temporales cortos (ejemplo: "_1", "_2")

                await this.triageRepository.update(currentTriage,{level:tempLevel,color:triages[i].color})
                
            }

            for (let i = 0; i < existingTriages.length; i++) {
                const currentTriage = existingTriages[i];
                const finalLevel = triages[i].level;
        
                await this.triageRepository.update(currentTriage, {
                  level: finalLevel,
                  color: triages[i].color
                });
            }

            return (await this.triageRepository.findAll()).map(t => new TriageOutputDTO(t));
        }catch(e){
            throw new HttpException(e.message,e.status | 500);
        }
    }
}
