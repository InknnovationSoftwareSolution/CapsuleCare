import { Test, TestingModule } from '@nestjs/testing';
import { Medicina } from './medications.entity';
import { MedicationsService } from './medications.service';
import { MedicationsController } from './medications.controller';



describe('UsersController', () => {
  let controller: MedicationsController;
  let service: MedicationsService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [MedicationsController],
      providers: [
        {
          provide: MedicationsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([new Medicina()]),
            findMedicina: jest.fn().mockResolvedValue(new Medicina()),
            createM: jest.fn().mockResolvedValue(new Medicina()),
            updateM: jest.fn().mockResolvedValue(new Medicina())
          },
        },
      ],
    }).compile();

    controller = moduleRef.get<MedicationsController>(MedicationsController);
    service = moduleRef.get<MedicationsService>(MedicationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await controller.getAll();
      expect(result).toEqual([new Medicina()]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const result = await controller.findMedic(1);
      expect(result).toEqual(new Medicina());
      expect(service.findMedicina).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const dto = {
        user: 1,
        name: "Prueba 1",
        quantity: 1
    };
      const result = await controller.agregarM(dto);
      expect(result).toEqual(new Medicina());
      expect(service.createM).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const dto = {
        name: "Prueba 2"
      };
      const result = await controller.actualizM(1, dto);
      expect(result).toEqual(new Medicina());
      expect(service.updateM).toHaveBeenCalledWith(1, dto);
    });
  });

});