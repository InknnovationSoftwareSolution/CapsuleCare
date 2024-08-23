import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shedules } from './shedules.entity';
import { newShed, updatShed } from './shedelus.dto';
import { Medicina } from '../medications/medications.entity';
import { Users } from '../users/users.entity';

@Injectable()
export class ShedulesService {
    constructor(
        @InjectRepository(Shedules) private readonly sRepository: Repository<Shedules>
    ) {}


/**
   * Crea una nueva alarma.
   * @param shed - Objeto o modelo de datos para la base de datos.
   * @return Retorna la alarma agregada.
   */
    async createS(shed: newShed): Promise<Shedules> {
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
    }


/**
   * Muestra todas las alarmas de la base de datos.
   * @returns Retorna todas las alarmas de la base de datos.
   */
    async findAll(): Promise<Shedules[]> {
        return await this.sRepository.find({
            relations: ['medicina', 'users', 'notifications'],
        });
    }


/**
   * Busca una alarma por ID.
   * @param id - ID unico de la alarma.
   * @return - Retorna la alarma buscada por ID.
   */
    async findShedules(id: number): Promise<Shedules> {
        const shedules = await this.sRepository.findOne({
            where: { id },
            relations: ['medicina', 'users', 'notifications'],
        });
        if (!shedules) {
            throw new NotFoundException(`Shedules with id ${id} not found`);
        }
        return shedules;
    }


/**
   * Actualiza las alarmas por ID.
   * @param id - ID unico por alarma.
   * @param shed -  Objeto o modelo de datos para la base de datos.
   * @return Retorna la respuesta del servido de como afecto a la fila.
   */
    async updateS(id: number, shed: updatShed) {

        const shedul = this.sRepository.create({
            interval_hours: shed.intervalo,
            finish_dose_time: shed.finish_time,
        });

        const updateResult = await this.sRepository.update(id, shedul);
        if (updateResult.affected === 0) {
            throw new NotFoundException(`Shedules with id ${id} not found`);
        }
    }


/**
   * Elimina la alarma por medio del ID.
   * @param id ID unico de la alarma.
   * @return Retorna la fila afectada
   */
    async deleteS(id: number): Promise<string> {
        const shedules = await this.sRepository.findOne({ where: { id } });
        if (!shedules) {
            throw new NotFoundException(`Shedules with id ${id} not found`);
        }

        await this.sRepository.delete(id);
        return 'Shedules deleted';
    }
}
