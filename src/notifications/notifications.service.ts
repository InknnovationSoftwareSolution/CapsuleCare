import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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

    async createN(notification: newNotificacion): Promise<Notifications> {
        try {
            const shedule = new Shedules();
            shedule.id = notification.schedule;

            const notifi = new Notifications();
            notifi.schedule = shedule;
            notifi.message = notification.message;
            notifi.sentAt = notification.sent;
            notifi.type = notification.type;

            return await this.notificationsRepository.save(notifi);
        } catch (error) {
            throw new BadRequestException('Error al crear la notificacion');
        }
    }

    async findAll(): Promise<Notifications[]> {
        try {
            return await this.notificationsRepository.find({
                relations: { schedule: true },
            });
        } catch (error) {
            throw new BadRequestException('Error al recuperar las notificaciones');
        }
    }

    async findNotification(id: number): Promise<Notifications> {
        try {
            const notification = await this.notificationsRepository.findOne({
                where: { id },
            });
            if (!notification) {
                throw new NotFoundException(`Notificación con id ${id} no encontrada`);
            }
            return notification;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException('Error al recuperar la notificacion');
        }
    }

    async updateN(id: number, updateNotification: Updatnotif): Promise<void> {
        try {
            const notification = await this.notificationsRepository.findOne({ where: { id } });
            if (!notification) {
                throw new NotFoundException(`Notificacion con id ${id} no encontrada`);
            }

            if (updateNotification.shedule) {
                const schedule = new Shedules();
                schedule.id = updateNotification.shedule;
                notification.schedule = schedule;
            }

            if (updateNotification.sent) {
                notification.sentAt = updateNotification.sent;
            }

            if (updateNotification.type) {
                notification.type = updateNotification.type;
            }

            if (updateNotification.message) {
                notification.message = updateNotification.message;
            }

            await this.notificationsRepository.save(notification);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException('Error al actualizar la notificacion');
        }
    }

    async deleteN(id: number): Promise<string> {
        try {
            const notification = await this.notificationsRepository.findOne({ where: { id } });

            if (!notification) {
                throw new NotFoundException(`Notificación con id ${id} no encontrada`);
            }

            await this.notificationsRepository.delete(id);
            return 'Notificación eliminada';
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException('Error al eliminar la notificacion');
        }
    }
}
