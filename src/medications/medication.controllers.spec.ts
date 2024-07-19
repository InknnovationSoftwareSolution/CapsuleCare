import { Test, TestingModule } from '@nestjs/testing';
import { MedicationsController } from './medications.controller';
import { MedicationsService } from './medications.service';
import { Newmedicina, Updatmedicina } from './medications.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('MedicationsController', () => {
    let controller: MedicationsController;
    let service: MedicationsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MedicationsController],
            providers: [
                {
                    provide: MedicationsService,
                    useValue: {
                        createM: jest.fn(),
                        findAll: jest.fn(),
                        findMedicina: jest.fn(),
                        updateM: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<MedicationsController>(MedicationsController);
        service = module.get<MedicationsService>(MedicationsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('agregarM', () => {
        it('should successfully add a medication', async () => {
            const newMedicina: Newmedicina = { /* Add properties here */ };
            jest.spyOn(service, 'createM').mockResolvedValue('Medication added');

            expect(await controller.agregarM(newMedicina)).toBe('Medication added');
        });

        it('should handle errors during addition', async () => {
            const newMedicina: Newmedicina = { /* Add properties here */ };
            jest.spyOn(service, 'createM').mockRejectedValue(new Error('Addition failed'));

            try {
                await controller.agregarM(newMedicina);
            } catch (error) {
                expect(error).toBeInstanceOf(HttpException);
                expect(error.response).toEqual({
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Error adding medication',
                });
                expect(error.status).toBe(HttpStatus.BAD_REQUEST);
            }
        });
    });

    describe('getAll', () => {
        it('should successfully retrieve all medications', async () => {
            jest.spyOn(service, 'findAll').mockResolvedValue(['Medication1', 'Medication2']);

            expect(await controller.getAll()).toEqual(['Medication1', 'Medication2']);
        });

        it('should handle errors during retrieval', async () => {
            jest.spyOn(service, 'findAll').mockRejectedValue(new Error('Retrieval failed'));

            try {
                await controller.getAll();
            } catch (error) {
                expect(error).toBeInstanceOf(HttpException);
                expect(error.response).toEqual({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Error retrieving medications',
                });
                expect(error.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
    });

    describe('findMedic', () => {
        it('should successfully retrieve a medication by ID', async () => {
            const id = 1;
            jest.spyOn(service, 'findMedicina').mockResolvedValue({ id, name: 'Medication1' });

            expect(await controller.findMedic(id)).toEqual({ id, name: 'Medication1' });
        });

        it('should handle errors during retrieval', async () => {
            const id = 1;
            jest.spyOn(service, 'findMedicina').mockRejectedValue(new Error('Retrieval failed'));

            try {
                await controller.findMedic(id);
            } catch (error) {
                expect(error).toBeInstanceOf(HttpException);
                expect(error.response).toEqual({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Error retrieving medication',
                });
                expect(error.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });

        it('should handle case when medication is not found', async () => {
            const id = 1;
            jest.spyOn(service, 'findMedicina').mockResolvedValue(null);

            try {
                await controller.findMedic(id);
            } catch (error) {
                expect(error).toBeInstanceOf(HttpException);
                expect(error.response).toEqual({
                    status: HttpStatus.NOT_FOUND,
                    error: 'Medication not found',
                });
                expect(error.status).toBe(HttpStatus.NOT_FOUND);
            }
        });
    });

    describe('actualizM', () => {
        it('should successfully update a medication', async () => {
            const id = 1;
            const updatU: Updatmedicina = { /* Add properties here */ };
            jest.spyOn(service, 'updateM').mockResolvedValue({ id, ...updatU });

            expect(await controller.actualizM(id, updatU)).toEqual({ id, ...updatU });
        });

        it('should handle errors during update', async () => {
            const id = 1;
            const updatU: Updatmedicina = { /* Add properties here */ };
            jest.spyOn(service, 'updateM').mockRejectedValue(new Error('Update failed'));

            try {
                await controller.actualizM(id, updatU);
            } catch (error) {
                expect(error).toBeInstanceOf(HttpException);
                expect(error.response).toEqual({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Error updating medication',
                });
                expect(error.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });

        it('should handle case when medication is not found for update', async () => {
            const id = 1;
            const updatU: Updatmedicina = { /* Add properties here */ };
            jest.spyOn(service, 'updateM').mockResolvedValue(null);

            try {
                await controller.actualizM(id, updatU);
            } catch (error) {
                expect(error).toBeInstanceOf(HttpException);
                expect(error.response).toEqual({
                    status: HttpStatus.NOT_FOUND,
                    error: 'Medication not found for update',
                });
                expect(error.status).toBe(HttpStatus.NOT_FOUND);
            }
        });
    });
});
