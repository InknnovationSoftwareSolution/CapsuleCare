import { Test, TestingModule } from '@nestjs/testing';
import { ShedulesController } from './shedules.controller';
import { ShedulesService } from './shedules.service';
import { Shedules } from './shedules.entity';


describe('UsersController', () => {
  let controller: ShedulesController;
  let service: ShedulesService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ShedulesController],
      providers: [
        {
          provide: ShedulesService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([new Shedules()]),
            findShedules: jest.fn().mockResolvedValue(new Shedules()),
            createS: jest.fn().mockResolvedValue(new Shedules()),
            updateS: jest.fn().mockResolvedValue(new Shedules()),
            deleteS: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    controller = moduleRef.get<ShedulesController>(ShedulesController);
    service = moduleRef.get<ShedulesService>(ShedulesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([new Shedules()]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const result = await controller.findOne(1);
      expect(result).toEqual(new Shedules());
      expect(service.findShedules).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const dto = {
        medicina: 1,
        user: 1,
        intervalo: 8,
        finish_time:  new Date('2024-10-27T22:39:22')
    };
      const result = await controller.create(dto);
      expect(result).toEqual(new Shedules());
      expect(service.createS).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const dto = {
        "intervalo":  9,
        "finish_time":  new Date('2024-10-27T22:39:22')
      };
      const result = await controller.update(1, dto);
      expect(result).toEqual(new Shedules());
      expect(service.updateS).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const result = await controller.delete(1);
      expect(result).toEqual({});
      expect(service.deleteS).toHaveBeenCalledWith(1);
    });
  });
});