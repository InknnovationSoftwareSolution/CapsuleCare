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


  /**
   * Crea una nueva notificacion.
   * @param notification - Objeto o modelo de datos para la base de datos.
   * @return Regresa la informacion de la notificacion.
   */
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


/**
   * Muestra una lista de notificaciones con relacion join con shedules
   * @returns Retorna toda la lsita de notificaciones
   */
    async findAll(): Promise<Notifications[]> {
        return await this.notificationsRepository.find({
            relations: {
                schedule: true
            },
        });
    }


/**
   * Busqueda por ID en la tabla notificaciones
   * @param id - Id unico de una notificacion.
   * @return Retorna la notificacion buscado por ID
   */
    async findNotification(id: number) {
        const notification = await this.notificationsRepository.findOne({
            where: { id },
        });
        if (!notification) {
            throw new NotFoundException('Notification not found');
        }
        return notification;
    }


/**
   * Actualiza notificacion por ID
   * @param id - The ID of the user.
   * @param updateNotification - Objeto o modelo de datos para la base de datos.
   * @return Regresa la respuesta de si fue afectada la fila
   */
    async updateN(id: number, updateNotification: Updatnotif) {
        const result = await this.notificationsRepository.update(id, updateNotification);
        if (result.affected === 0) {
            throw new NotFoundException('Notification not found');
        }
    }


/**
   * Elimina notificacion por ID
   * @param id - ID inico de una notificacion
   * @return Regresa una respuesta de la funcion
   */
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