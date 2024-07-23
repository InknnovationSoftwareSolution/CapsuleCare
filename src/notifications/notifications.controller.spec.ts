import { Test, TestingModule } from '@nestjs/testing';
import { Notifications } from './notifications.entity';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

describe('UsersController', () => {
  let controller: NotificationsController;
  let service: NotificationsService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        {
          provide: NotificationsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([new Notifications()]),
            findNotification: jest.fn().mockResolvedValue(new Notifications()),
            createN: jest.fn().mockResolvedValue(new Notifications()),
            updateN: jest.fn().mockResolvedValue(new Notifications()),
            deleteN: jest.fn().mockResolvedValue({})

          },
        },
      ],
    }).compile();

    controller = moduleRef.get<NotificationsController>(NotificationsController);
    service = moduleRef.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await controller.getAll();
      expect(result).toEqual([new Notifications()]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const result = await controller.findNotif(1);
      expect(result).toEqual(new Notifications());
      expect(service.findNotification).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const dto = {
        user: 1,
        schedule: 1,
        sent: new Date('2024-10-27T22:39:22'),
        type: "Prueba",
        message: "Mensaje de prueba"
    };
      const result = await controller.agregarN(dto);
      expect(result).toEqual(new Notifications());
      expect(service.createN).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const dto = {
        user: 1,
        schedule: 1,
        sent: new Date('2024-10-27T22:39:22'),
        type: "Prueba",
        message: "Mensaje de prueba"
      };
      const result = await controller.actualizN(1, dto);
      expect(result).toEqual(new Notifications());
      expect(service.updateN).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const result = await controller.deletNotif(1);
      expect(result).toEqual({});
      expect(service.deleteN).toHaveBeenCalledWith(1);
    });
  });

});