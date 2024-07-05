import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Users } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { updateUser, usersNew } from './users.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users) private readonly userRepository: Repository<Users>,
    ) {}

    async agregarUser(user: usersNew): Promise<Users> {
        return await this.userRepository.save(user);
    }

    async getUsers(): Promise<Users[]> {
        return await this.userRepository.find({
            relations: {
                shedules: true,
                medicina: true
            },
        });
    }

    async findUser(id: number): Promise<Users> {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: {
                medicina: true,
                shedules: true
            }
        });
        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        return user;
    }

    async updateUser(id: number, user: updateUser): Promise<void> {
        const updateResult = await this.userRepository.update(id, user);
        if (updateResult.affected === 0) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
    }

    async deleteUser(id: number): Promise<string> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        await this.userRepository.delete(id);
        return 'User deleted';
    }
}