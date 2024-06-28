import { Injectable } from '@nestjs/common';
import { Medicina } from './medications.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Newmedicina, Updatmedicina } from './medications.dto';

@Injectable()
export class MedicationsService {
    constructor(
        @InjectRepository(Medicina) private readonly MRepository: Repository<Medicina>
    ){}

    async createM(medicina: Newmedicina){
        return await this.MRepository.save(medicina)
    }

    async findAll(){
        return this.MRepository.find({
            relations: {
                user: true,
                schedules: true
            }
        }
        );
    }
    
    async findMedicina(id: number){
        return this.MRepository.find({
            where: {
                id
            },
            relations: {
                user: true,
                schedules: true
            }
        }
        );
    }

    async updateM(id: number, medicina: Updatmedicina){
        return this.MRepository.update(id, medicina);
    }

    async deleteM(id: number){
        const find = await this.MRepository.findOne({where: {id}});
        if(!find){
            throw new Error('No existe');
            
        }
        this.MRepository.delete(id);
        return "borrado"
    }
}
