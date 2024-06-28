import { Injectable } from '@nestjs/common';
import { NumericType, Repository } from 'typeorm';
import { Users } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { updateUser, usersNew } from './users.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users) private readonly UserRepository: Repository<Users>
    ){}

    async agregarUser(Users: usersNew){
        const findUser = await this.UserRepository.find({
            where: {
                email: Users.email
            }
        })

        if(findUser){
            throw new Error('Usuario existente')
        }

        return this.UserRepository.save(Users);
    }

    async getUsers(){
        return await this.UserRepository.find({
            relations: {
                medicina: true,
                shedules: true
            }
        })
    }

    async FindUser(id: number){
        return await this.UserRepository.findOne({where: {id}, relations:
            ['medicina', 'medicina.shedules', 'medicina.shedules.notifications']})
    }

    async UpdateUser(id: number, User: updateUser){
        return this.UserRepository.update(id, User)
    }

    async DeleteUser(id: number){
        const find = await this.UserRepository.findOne({where: {id}})
        if(!find){
            throw new Error('Usuario no encontrado')
        }

        this.UserRepository.delete(id);
        return 'Borrado';
    }

}
