import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Users } from './users.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            getUsers: jest.fn().mockResolvedValue([new Users()]),
            findUser: jest.fn().mockResolvedValue(new Users()),
            agregarUser: jest.fn().mockResolvedValue(new Users()),
            updateUser: jest.fn().mockResolvedValue(new Users()),
            deleteUser: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    controller = moduleRef.get<UsersController>(UsersController);
    service = moduleRef.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await controller.Find();
      expect(result).toEqual([new Users()]);
      expect(service.getUsers).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const result = await controller.findOne(1);
      expect(result).toEqual(new Users());
      expect(service.findUser).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const dto = { userName: 'Test User', email: 'example@gmail.com', password: '123456' };
      const result = await controller.insert(dto);
      expect(result).toEqual(new Users());
      expect(service.agregarUser).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const dto = { userName: 'Updated User', email: 'updated@gmail.com', password: '654321' };
      const result = await controller.updateUser(1, dto);
      expect(result).toEqual(new Users());
      expect(service.updateUser).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const result = await controller.deleteUser(1);
      expect(result).toEqual({});
      expect(service.deleteUser).toHaveBeenCalledWith(1);
    });
  });
});