import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shedules } from './shedules.entity';
import { newShed, updateS } from './shedelus.dto';
import { Medicina } from '../medications/medications.entity';
import { Users } from '../users/users.entity';

@Injectable()
export class ShedulesService {
    constructor(
        @InjectRepository(Shedules) private readonly sRepository: Repository<Shedules>
    ) {}

    async createS(shed: newShed): Promise<Shedules> {
        try {
            const medicina = new Medicina();
            medicina.id = shed.medicina;

            const user = new Users();
            user.id = shed.user;

            const shedul = this.sRepository.create({
                medicina,
                users: user,
                interval_hours: shed.intervalo,
                finish_dose_time: shed.finish_time,
            });

            return await this.sRepository.save(shedul);
        } catch (error) {
            throw new BadRequestException('Error al crear el horario');
        }
    }

    async findAll(): Promise<Shedules[]> {
        try {
            return await this.sRepository.find({
                relations: ['medicina', 'users', 'notifications'],
            });
        } catch (error) {
            throw new BadRequestException('Error al recuperar los horarios');
        }
    }

    async findShedules(id: number): Promise<Shedules> {
        try {
            const shedules = await this.sRepository.findOne({
                where: { id },
                relations: ['medicina', 'users', 'notifications'],
            });
            if (!shedules) {
                throw new NotFoundException(`Horario con id ${id} no encontrado`);
            }
            return shedules;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException('Error al recuperar el horario');
        }
    }

    async updateS(id: number, shed: updatShed): Promise<void> {
        try {
            const shedul = await this.sRepository.findOne({ where: { id } });
            if (!shedul) {
                throw new NotFoundException(`Horario con id ${id} no encontrado`);
            }

            if (shed.medicina) {
                const medicina = new Medicina();
                medicina.id = shed.medicina;
                shedul.medicina = medicina;
            }

            if (shed.user) {
                const user = new Users();
                user.id = shed.user;
                shedul.users = user;
            }

            if (shed.intervalo) {
                shedul.interval_hours = shed.intervalo;
            }

            if (shed.finish_time) {
                shedul.finish_dose_time = shed.finish_time;
            }

            await this.sRepository.save(shedul);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException('Error al actualizar el horario');
        }
    }

    async deleteS(id: number): Promise<string> {
        try {
            const shedules = await this.sRepository.findOne({ where: { id } });

            if (!shedules) {
                throw new NotFoundException(`Horario con id ${id} no encontrado`);
            }

            await this.sRepository.delete(id);
            return 'Horario eliminado';
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException('Error al eliminar el horario');
        }
    }
}
