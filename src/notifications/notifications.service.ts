import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notifications } from './notifications.entity';
import { Repository } from 'typeorm';
import { Updatnotif } from './notificationss.dto';
import { newNotificacion } from './notifications.dto';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(Notifications) private readonly NeRepository: Repository<Notifications>
    ){}

    async createN(Notific: newNotificacion){
        return await this.NeRepository.save(Notific);
    }

    async findAll(){
        return this.NeRepository.find({
            relations: {
                schedeles: true
            }
        })
    }

    async findNotification(id){
        const findN = await this.NeRepository.findOne({
            where : {id}
        });
        if(!findN){
            throw new Error('No ahi existencias')
        }
        return findN;
    }

    async updateN(id: number, noti : Updatnotif){
        const findN = await this.NeRepository.findOne({
            where: {
                id
            }
        });
        if(!findN){
            throw new Error('no existe')
        };
        return this.NeRepository.update(id, noti)
    }

    async deleteN(id: number){
        const findN = await this.NeRepository.findOne({
            where: {
                id
            }
        });
        if(!findN){
            throw new Error('no existe')
        };
        this.NeRepository.delete(id)

        return "borrado";
    }
}
