import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shedules } from './shedules.entity';
import { newShed, updatShed } from './shedelus.dto';
import { Medicina } from 'src/medications/medications.entity';
import { Users } from 'src/users/users.entity';

@Injectable()
export class ShedulesService {
    constructor(
        @InjectRepository(Shedules) private readonly sRepository: Repository<Shedules>
    ) {}

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

    async findAll(): Promise<Shedules[]> {
        return await this.sRepository.find({
            relations: ['medicina', 'users', 'notifications'],
        });
    }

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

    // async updateS(id: number, shed: updatShed) {
    //     const updateResult = await this.sRepository.update(id, shed);
    //     if (updateResult.affected === 0) {
    //         throw new NotFoundException(`Shedules with id ${id} not found`);
    //     }
    // }

    async deleteS(id: number): Promise<string> {
        const shedules = await this.sRepository.findOne({ where: { id } });
        if (!shedules) {
            throw new NotFoundException(`Shedules with id ${id} not found`);
        }

        await this.sRepository.delete(id);
        return 'Shedules deleted';
    }
}
