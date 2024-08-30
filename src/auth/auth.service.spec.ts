import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from '../users/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersRepository: Repository<Users>;
  let jwtService: JwtService;

  const mockUsersRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(Users), useValue: mockUsersRepository },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersRepository = module.get<Repository<Users>>(getRepositoryToken(Users));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('debería lanzar BadRequestException si el usuario ya existe', async () => {
      mockUsersRepository.findOne = jest.fn().mockResolvedValueOnce({ email: 'test@example.com' });
      const createUserDto: CreateUserDto = { name: 'Test', email: 'test@example.com', password: 'password' };
      await expect(service.register(createUserDto)).rejects.toThrow(BadRequestException);
    });

    it('debería devolver un token de acceso si el registro es exitoso', async () => {
      mockUsersRepository.findOne = jest.fn().mockResolvedValueOnce(null);
      mockUsersRepository.create = jest.fn().mockReturnValue({ email: 'test@example.com', id: 1 });
      mockUsersRepository.save = jest.fn().mockResolvedValue(true);
      mockJwtService.sign = jest.fn().mockReturnValue('access_token');
      const createUserDto: CreateUserDto = { name: 'Test', email: 'test@example.com', password: 'password' };
      const result = await service.register(createUserDto);
      expect(result).toEqual({ access_token: 'access_token' });
    });

    it('debería lanzar BadRequestException si ocurre un error durante el registro', async () => {
      mockUsersRepository.findOne = jest.fn().mockRejectedValue(new Error('Error'));
      const createUserDto: CreateUserDto = { name: 'Test', email: 'test@example.com', password: 'password' };
      await expect(service.register(createUserDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    it('debería lanzar NotFoundException si el usuario no es encontrado', async () => {
      mockUsersRepository.findOne = jest.fn().mockResolvedValueOnce(null);
      const loginUserDto: LoginUserDto = { email: 'test@example.com', password: 'password' };
      await expect(service.login(loginUserDto)).rejects.toThrow(NotFoundException);
    });

    it('debería lanzar UnauthorizedException si la contraseña es incorrecta', async () => {
      mockUsersRepository.findOne = jest.fn().mockResolvedValueOnce({ email: 'test@example.com', password: 'hashed_password' });
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);
      const loginUserDto: LoginUserDto = { email: 'test@example.com', password: 'password' };
      await expect(service.login(loginUserDto)).rejects.toThrow(UnauthorizedException);
    });

    it('debería devolver un token de acceso si el inicio de sesión es exitoso', async () => {
      mockUsersRepository.findOne = jest.fn().mockResolvedValueOnce({ email: 'test@example.com', password: 'hashed_password' });
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);
      mockJwtService.sign = jest.fn().mockReturnValue('access_token');
      const loginUserDto: LoginUserDto = { email: 'test@example.com', password: 'password' };
      const result = await service.login(loginUserDto);
      expect(result).toEqual({ access_token: 'access_token' });
    });

    it('debería lanzar BadRequestException si ocurre un error durante el inicio de sesión', async () => {
      mockUsersRepository.findOne = jest.fn().mockRejectedValue(new Error('Error'));
      const loginUserDto: LoginUserDto = { email: 'test@example.com', password: 'password' };
      await expect(service.login(loginUserDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('validateUser', () => {
    it('debería devolver los detalles del usuario si la validación es exitosa', async () => {
      mockUsersRepository.findOne = jest.fn().mockResolvedValueOnce({ email: 'test@example.com', password: 'hashed_password', id: 1 });
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);
      const result = await service.validateUser('test@example.com', 'password');
      expect(result).toEqual({ email: 'test@example.com', id: 1 });
    });

    it('debería devolver null si la validación falla', async () => {
      mockUsersRepository.findOne = jest.fn().mockResolvedValueOnce({ email: 'test@example.com', password: 'hashed_password' });
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);
      const result = await service.validateUser('test@example.com', 'wrong_password');
      expect(result).toBeNull();
    });

    it('debería lanzar BadRequestException si ocurre un error durante la validación', async () => {
      mockUsersRepository.findOne = jest.fn().mockRejectedValue(new Error('Error'));
      const result = await service.validateUser('test@example.com', 'password');
      await expect(result).toBeNull();
    });
  });
});
