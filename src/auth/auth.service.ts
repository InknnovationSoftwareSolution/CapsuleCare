import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Users } from '../users/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private jwtService: JwtService
  ) {}

  /**
   * Se crea un tocken de acceso para usuarios registrados en la base de datos
   * @param createUserDto Objeto o modelo de datos para la base de datos.
   * @returns Retorna el nuevo tocken de acceso
   */
  async register(createUserDto: CreateUserDto) {
    const { userName, email, password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      userName,
      email,
      password: hashedPassword,
      createdAt: true,
    });

    await this.usersRepository.save(user);
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

/**
   * Verifica el tocken en caso de iniciar seccion
   * @param id The ID of the user.
   * @returns The user data.
   */
  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      const payload = { email: user.email, sub: user.id };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
    throw new Error('Las credenciales no coinciden');
  }

/**
   * Valida el usuario con la base de datos y el tocken.
   * @param email Correo del usuario.
   * @param password Clave del usuario.
   * @returns Retorna el resultado de la comparacion.
   */
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}