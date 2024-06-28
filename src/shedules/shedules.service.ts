import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shedules } from './shedules.entity';
import { newShed, updatShed } from './shedelus.dto';
import { Medicina } from 'src/medications/medications.entity';
import { Users } from 'src/users/users.entity';

@Injectable()
export class ShedulesService {
    constructor(
        @InjectRepository(Shedules) private readonly SRepository: Repository<Shedules>
    ){}

    async createS(shed: newShed){

        const medicina = new Medicina();
        medicina.id = shed.medicina;

        const user = new Users();
        user.id = shed.user;

        const shedul = new Shedules();
        shedul.medicina = medicina;
        shedul.users = user;
        shedul.interval_hours = shed.intervalo;
        shedul.finish_dose_time = shed.finish_time;

        return await this.SRepository.save(shedul)
    }

    async findAll(){
        return await this.SRepository.find({
            relations: {
                medicina: true,
                users: true,
                notifications: true
            }
        })
    }

    async findShedules(id: number){
        return await this.SRepository.find({
            where : {
                id
            },
            relations: {
                medicina: true,
                users: true,
                notifications: true
            }
        })
    }

    // async updateS(id: number, shed: updatShed){
    //     const shedule = await this.SRepository.findOne({where: {id}})
    //     if(!shedule){
    //         throw new Error("No existe");
    //     }
    //     return await this.SRepository.update(id, shed)
    // }

    async deleteS(id: number){
        const Shedul = await this.SRepository.findOne({where: {id}})

        if(!Shedul){
            throw new Error('No existente');
        }

        this.SRepository.delete(id);

        return 'Borrado'

    }

}
