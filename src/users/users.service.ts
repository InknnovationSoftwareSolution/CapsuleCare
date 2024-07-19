import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Users } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { updateUser, usersNew } from './users.dto';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';
import { LoginUserDto } from '../auth/dto/login-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users) private readonly userRepository: Repository<Users>,
        private authService: AuthService,
    ) {}

    async register(user: usersNew): Promise<any> {
        try {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            const newUser = this.userRepository.create({
                ...user,
                password: hashedPassword,
            });
            await this.userRepository.save(newUser);
            
            //Generate access token
            const payload = { email: newUser.email, sub: newUser.id };
            const accessToken = this.authService.generateToken(payload);
            
            //return both access token and user data
            return {
                access_token: accessToken,
                user: newUser,
            };
        } catch (error) {
            throw new BadRequestException('Error al registrar el usuario');
        }
    }

    async login(loginUserDto: LoginUserDto): Promise<any> {
        try {
            const { email, password } = loginUserDto;
            const user = await this.userRepository.findOne({ where: { email } });
            if (user && await bcrypt.compare(password, user.password)) {
                const payload = { email: user.email, sub: user.id };
                const accessToken = this.authService.generateToken(payload);
                return {
                    access_token: accessToken,
                };
            }
            throw new BadRequestException('Las credenciales no coinciden');
        } catch (error) {
            throw new BadRequestException('Error al iniciar sesion');
        }
    }

    async agregarUser(user: usersNew): Promise<Users> {
        try {
            return await this.userRepository.save(user);
        } catch (error) {
            throw new BadRequestException('Error al agregar el usuario');
        }
    }

    async getUsers(): Promise<Users[]> {
        try {
            return await this.userRepository.find({
                relations: {
                    shedules: true,
                    medicina: true
                },
            });
        } catch (error) {
            throw new BadRequestException('Error al obtener los usuarios');
        }
    }

    async findUser(id: number): Promise<Users> {
        try {
            const user = await this.userRepository.findOne({
                where: { id },
                relations: {
                    medicina: true,
                    shedules: true
                }
            });
            if (!user) {
                throw new NotFoundException(`Usuario con id ${id} no encontrado`);
            }
            return user;
        } catch (error) {
            throw new BadRequestException('Error al buscar el usuario');
        }
    }

    async updateUser(id: number, user: updateUser): Promise<void> {
        try {
            const updateResult = await this.userRepository.update(id, user);
            if (updateResult.affected === 0) {
                throw new NotFoundException(`Usuario con id ${id} no encontrado`);
            }
        } catch (error) {
            throw new BadRequestException('Error al actualizar el usuario');
        }
    }

    async deleteUser(id: number): Promise<string> {
        try {
            const user = await this.userRepository.findOne({ where: { id } });
            if (!user) {
                throw new NotFoundException(`Usuario con id ${id} no encontrado`);
            }
            await this.userRepository.delete(id);
            return 'Usuario eliminado';
        } catch (error) {
            throw new BadRequestException('Error al eliminar el usuario');
        }
    }
}
