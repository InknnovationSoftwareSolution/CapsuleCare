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

/**
   * Crea un nuevo usuario
   * @param user  Objeto o modelo de datos para la base de datos.
   * @return Retorna el usuario creado.
    */
    async agregarUser(user: usersNew): Promise<Users> {
        return await this.userRepository.save(user);
    }

/**
   * Muestra todos los usuario existente en la base de datos
   * @returns The user data.
   */
    async getUsers(): Promise<Users[]> {
        return await this.userRepository.find({
            relations: {
                shedules: true,
                medicina: true
            },
        });
    }

/**
   * Busca al usuario por ID
   * @param id Id unico del usuario .
   * @return Retorna el usuario existente
   */
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

/**
   * Actualiza un usuario por medio del ID.
   * @param id Id unico del usuario.
   * @param user Objeto o modelo de datos para la base de datos.
   * @return Retorna una respuesta de la fila afectada por la funcion.
   */
    async updateUser(id: number, user: updateUser): Promise<void> {
        const updateResult = await this.userRepository.update(id, user);
        if (updateResult.affected === 0) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
    }

/**
   * Elimina un usuario por medio del ID.
   * @param id Id unico del usuario.
   * @return Retorna una respuesta de la fila afectada por la funcion.
   */
    async deleteUser(id: number): Promise<string> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        await this.userRepository.delete(id);
        return 'User deleted';
    }
}