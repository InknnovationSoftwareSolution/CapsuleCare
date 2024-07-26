import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { Users } from './users.entity';
import { AuthService } from '../auth/auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { updateUser, usersNew } from './users.dto';
import { LoginUserDto } from '../auth/dto/login-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<Users>;
  let authService: AuthService;

  beforeEach(async () => {
    const mockUserRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const mockAuthService = {
      generateToken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(Users), useValue: mockUserRepository },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<Users>>(getRepositoryToken(Users));
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should throw BadRequestException on error', async () => {
      const userDto: usersNew = { email: 'test@example.com', password: 'password' };

      jest.spyOn(userRepository, 'save').mockRejectedValueOnce(new Error('Database error'));

      await expect(service.register(userDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    it('should throw BadRequestException when credentials are incorrect', async () => {
      const loginDto: LoginUserDto = { email: 'test@example.com', password: 'password' };

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.login(loginDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException on bcrypt error', async () => {
      const loginDto: LoginUserDto = { email: 'test@example.com', password: 'password' };
      const user = { email: 'test@example.com', password: 'hashedPassword' };

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(user);
      jest.spyOn(bcrypt, 'compare').mockRejectedValueOnce(new Error('Bcrypt error'));

      await expect(service.login(loginDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('agregarUser', () => {
    it('should throw BadRequestException on error', async () => {
      const userDto: usersNew = { email: 'test@example.com', password: 'password' };

      jest.spyOn(userRepository, 'save').mockRejectedValueOnce(new Error('Database error'));

      await expect(service.agregarUser(userDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getUsers', () => {
    it('should throw BadRequestException on error', async () => {
      jest.spyOn(userRepository, 'find').mockRejectedValueOnce(new Error('Database error'));

      await expect(service.getUsers()).rejects.toThrow(BadRequestException);
    });
  });

  describe('findUser', () => {
    it('should throw NotFoundException when user not found', async () => {
      const userId = 1;
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.findUser(userId)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException on error', async () => {
      const userId = 1;
      jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error('Database error'));

      await expect(service.findUser(userId)).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateUser', () => {
    it('should throw NotFoundException when user not found', async () => {
      const userId = 1;
      const updateDto: updateUser = { email: 'updated@example.com' };

      jest.spyOn(userRepository, 'update').mockResolvedValueOnce({ affected: 0 });

      await expect(service.updateUser(userId, updateDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException on error', async () => {
      const userId = 1;
      const updateDto: updateUser = { email: 'updated@example.com' };

      jest.spyOn(userRepository, 'update').mockRejectedValueOnce(new Error('Database error'));

      await expect(service.updateUser(userId, updateDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteUser', () => {
    it('should throw NotFoundException when user not found', async () => {
      const userId = 1;
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.deleteUser(userId)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException on error', async () => {
      const userId = 1;
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce({ id: userId } as Users);
      jest.spyOn(userRepository, 'delete').mockRejectedValueOnce(new Error('Database error'));

      await expect(service.deleteUser(userId)).rejects.toThrow(BadRequestException);
    });
  });
});
