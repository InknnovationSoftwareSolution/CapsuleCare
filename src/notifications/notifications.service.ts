import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notifications } from './notifications.entity';
import { newNotificacion } from './notifications.dto';
import { Updatnotif } from './notificationss.dto';
import { Shedules } from '../shedules/shedules.entity';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(Notifications) private readonly notificationsRepository: Repository<Notifications>
    ) {}

    async createN(notification: newNotificacion){
        const shedule = new Shedules();
        shedule.id = notification.schedule;

        const notifi = new Notifications();
        notifi.schedule = shedule;
        notifi.message = notification.message;
        notifi.sentAt = notification.sent;
        notifi.type = notification.type;
        return await this.notificationsRepository.save(notifi);
    }

    async findAll(): Promise<Notifications[]> {
        return await this.notificationsRepository.find({
            relations: {
                schedule: true
            },
        });
    }

    async findNotification(id: number) {
        const notification = await this.notificationsRepository.findOne({
            where: { id },
        });
        if (!notification) {
            throw new NotFoundException('Notification not found');
        }
        return notification;
    }

    async updateN(id: number, updateNotification: Updatnotif) {
        const result = await this.notificationsRepository.update(id, updateNotification);
        if (result.affected === 0) {
            throw new NotFoundException('Notification not found');
        }
    }

    async deleteN(id: number){
        const notification = await this.notificationsRepository.findOne({
            where: { id },
        });
        if (!notification) {
            throw new NotFoundException('Notification not found');
        }
        await this.notificationsRepository.delete(id);
        return 'Notification deleted';
    }
}