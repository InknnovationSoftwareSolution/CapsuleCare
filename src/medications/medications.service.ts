import { Injectable, NotFoundException } from '@nestjs/common';
import { Medicina } from './medications.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Newmedicina, Updatmedicina } from './medications.dto';
import { Users } from '../users/users.entity';

@Injectable()
export class MedicationsService {
    constructor(
        @InjectRepository(Medicina) 
        private readonly MRepository: Repository<Medicina>,
    ){}

   /**
   * Crea un nuevo registro de un medicamento
   * @param medicina Objeto o modelo de datos para la base de datos.
   * @return Retorna el nuevo medicamento registrado.
   */
    async createM(medicina: Newmedicina): Promise<Medicina> {
        const user = new Users();
        user.id = medicina.user;
        
        const med = new Medicina();
        med.name = medicina.name;
        med.user = user;
        med.quantity = medicina.quantity;
        return await this.MRepository.save(med);
    }

/**
   * Muestra una lista de medicamentos existentes
   * @returns Retorna todos los medicamentos existentes
   */
    async findAll(): Promise<Medicina[]> {
        return await this.MRepository.find({ relations: ['user'] });
    }

/**
   * Busca por ID un medicamento en la base de datos
   * @param id Id unico del medicamento.
   * @return El medicamento buscado por ID
   */
    async findMedicina(id: number): Promise<Medicina> {
        const medicina = await this.MRepository.findOne({
            where: { id },
            relations: {
                user: true,
                schedules: true
            }//['user', 'schedules'],
        });
        if (!medicina) {
            throw new NotFoundException(`Medicina with id ${id} not found`);
        }
        return medicina;
    }

/**
   * Actualiza los medicamentos por ID.
   * @param id ID unico del medicamento.
   * @param medicina  Objeto o modelo de datos para la base de datos.
   * @return Retorna la fila afectada por la funcion.
   */
    async updateM(id: number, medicina: Updatmedicina): Promise<void> {
        const updateResult = await this.MRepository.update(id, medicina);
        if (updateResult.affected === 0) {
            throw new NotFoundException(`Medicina with id ${id} not found`);
        }
    }

/**
   * Elimina el medicamento por ID.
   * @param id ID unico por medicamento
   * @return Retorna la fila afectada por la funcion.
   */
    async deleteM(id: number): Promise<string> {
        const find = await this.MRepository.findOne({ where: { id } });
        if (!find) {
            throw new NotFoundException(`Medicina with id ${id} not found`);
        }
        await this.MRepository.delete(id);
        return 'Medicina borrada';
    }
}