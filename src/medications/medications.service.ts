import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medicina } from './medications.entity';
import { Newmedicina, Updatmedicina } from './medications.dto';
import { Users } from 'src/users/users.entity';

@Injectable()
export class MedicationsService {
    constructor(
        @InjectRepository(Medicina)
        private readonly MRepository: Repository<Medicina>,
    ) {}

    async createM(medicina: Newmedicina): Promise<Medicina> {
        try {
            const user = new Users();
            user.id = medicina.user;

            const med = new Medicina();
            med.name = medicina.name;
            med.quantity = medicina.quantity;
            med.user = user;

            return await this.MRepository.save(med);
        } catch (error) {
            throw new BadRequestException('Error al crear la medicina');
        }
    }

    async findAll(): Promise<Medicina[]> {
        try {
            return await this.MRepository.find({ relations: ['user'] });
        } catch (error) {
            throw new BadRequestException('Error al recuperar las medicinas');
        }
    }

    async findMedicina(id: number): Promise<Medicina> {
        try {
            const medicina = await this.MRepository.findOne({
                where: { id },
                relations: ['user', 'schedules'],
            });
            if (!medicina) {
                throw new NotFoundException(`Medicina con id ${id} no encontrada`);
            }
            return medicina;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException('Error al recuperar la medicina');
        }
    }

    async updateM(id: number, medicina: Updatmedicina): Promise<void> {
        try {
            const updateResult = await this.MRepository.update(id, medicina);
            if (updateResult.affected === 0) {
                throw new NotFoundException(`Medicina con id ${id} no encontrada`);
            }
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException('Error al actualizar la medicina');
        }
    }

    async deleteM(id: number): Promise<string> {
        try {
            const find = await this.MRepository.findOne({ where: { id } });
            if (!find) {
                throw new NotFoundException(`Medicina con id ${id} no encontrada`);
            }
            await this.MRepository.delete(id);
            return 'Medicina borrada';
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException('Error al borrar la medicina');
        }
    }
}
