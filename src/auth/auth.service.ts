import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
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

  async register(createUserDto: CreateUserDto) {
    try {
      const { name, email, password } = createUserDto;
      const existingUser = await this.usersRepository.findOne({ where: { email } });

      if (existingUser) {
        throw new BadRequestException('El usuario ya existe con ese correo electronico');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = this.usersRepository.create({
        userName: name,
        email,
        password: hashedPassword,
      });
      
      await this.usersRepository.save(user);
      const payload = { email: user.email, sub: user.id };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      throw new BadRequestException('Error al registrar el usuario');
    }
  }

  async login(loginUserDto: LoginUserDto) {
    try {
      const { email, password } = loginUserDto;
      const user = await this.usersRepository.findOne({ where: { email } });

      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      const passwordMatches = await bcrypt.compare(password, user.password);
      if (passwordMatches) {
        const payload = { email: user.email, sub: user.id };
        return {
          access_token: this.jwtService.sign(payload),
        };
      } else {
        throw new UnauthorizedException('Las credenciales no coinciden');
      }
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
        throw error; 
      }
      throw new BadRequestException('Error al iniciar sesion');
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.usersRepository.findOne({ where: { email } });

      if (user && await bcrypt.compare(password, user.password)) {
        const { password, ...result } = user;
        return result;
      }
      return null;
    } catch (error) {
      throw new BadRequestException('Error al validar el usuario');
    }
  }

  generateToken(payload: any): string {
    return this.jwtService.sign(payload);
  }
}

