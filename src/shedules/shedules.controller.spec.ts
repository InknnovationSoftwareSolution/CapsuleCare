import { Test, TestingModule } from '@nestjs/testing';
import { ShedulesController } from './shedules.controller';
import { ShedulesService } from './shedules.service';
import { newShed, updatShed } from './shedelus.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('ShedulesController', () => {
    let controller: ShedulesController;
    let service: ShedulesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ShedulesController],
            providers: [
                {
                    provide: ShedulesService,
                    useValue: {
                        createS: jest.fn(),
                        findAll: jest.fn(),
                        findShedules: jest.fn(),
                        updateS: jest.fn(),
                        deleteS: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<ShedulesController>(ShedulesController);
        service = module.get<ShedulesService>(ShedulesService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should successfully create a schedule', async () => {
            const newSchedule: newShed = { /* Add properties here */ };
            jest.spyOn(service, 'createS').mockResolvedValue('Schedule created');

            expect(await controller.create(newSchedule)).toBe('Schedule created');
        });

        it('should handle errors during creation', async () => {
            const newSchedule: newShed = { /* Add properties here */ };
            jest.spyOn(service, 'createS').mockRejectedValue(new Error('Creation failed'));

            try {
                await controller.create(newSchedule);
            } catch (error) {
                expect(error).toBeInstanceOf(HttpException);
                expect(error.response).toEqual({
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Error creating schedule',
                });
                expect(error.status).toBe(HttpStatus.BAD_REQUEST);
            }
        });
    });

    describe('findAll', () => {
        it('should successfully retrieve all schedules', async () => {
            jest.spyOn(service, 'findAll').mockResolvedValue(['Schedule1', 'Schedule2']);

            expect(await controller.findAll()).toEqual(['Schedule1', 'Schedule2']);
        });

        it('should handle errors during retrieval', async () => {
            jest.spyOn(service, 'findAll').mockRejectedValue(new Error('Retrieval failed'));

            try {
                await controller.findAll();
            } catch (error) {
                expect(error).toBeInstanceOf(HttpException);
                expect(error.response).toEqual({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Error retrieving schedules',
                });
                expect(error.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
    });

    describe('findOne', () => {
        it('should successfully retrieve a schedule by ID', async () => {
            const id = 1;
            jest.spyOn(service, 'findShedules').mockResolvedValue({ id, message: 'Schedule1' });

            expect(await controller.findOne(id)).toEqual({ id, message: 'Schedule1' });
        });

        it('should handle errors during retrieval', async () => {
            const id = 1;
            jest.spyOn(service, 'findShedules').mockRejectedValue(new Error('Retrieval failed'));

            try {
                await controller.findOne(id);
            } catch (error) {
                expect(error).toBeInstanceOf(HttpException);
                expect(error.response).toEqual({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Error retrieving schedule',
                });
                expect(error.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });

        it('should handle case when schedule is not found', async () => {
            const id = 1;
            jest.spyOn(service, 'findShedules').mockResolvedValue(null);

            try {
                await controller.findOne(id);
            } catch (error) {
                expect(error).toBeInstanceOf(HttpException);
                expect(error.response).toEqual({
                    status: HttpStatus.NOT_FOUND,
                    error: 'Schedule not found',
                });
                expect(error.status).toBe(HttpStatus.NOT_FOUND);
            }
        });
    });

    describe('update', () => {
        it('should successfully update a schedule', async () => {
            const id = 1;
            const updateSchedule: updatShed = { /* Add properties here */ };
            jest.spyOn(service, 'updateS').mockResolvedValue({ id, ...updateSchedule });

            expect(await controller.update(id, updateSchedule)).toEqual({ id, ...updateSchedule });
        });

        it('should handle errors during update', async () => {
            const id = 1;
            const updateSchedule: updatShed = { /* Add properties here */ };
            jest.spyOn(service, 'updateS').mockRejectedValue(new Error('Update failed'));

            try {
                await controller.update(id, updateSchedule);
            } catch (error) {
                expect(error).toBeInstanceOf(HttpException);
                expect(error.response).toEqual({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Error updating schedule',
                });
                expect(error.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });

        it('should handle case when schedule is not found for update', async () => {
            const id = 1;
            const updateSchedule: updatShed = { /* Add properties here */ };
            jest.spyOn(service, 'updateS').mockResolvedValue(null);

            try {
                await controller.update(id, updateSchedule);
            } catch (error) {
                expect(error).toBeInstanceOf(HttpException);
                expect(error.response).toEqual({
                    status: HttpStatus.NOT_FOUND,
                    error: 'Schedule not found for update',
                });
                expect(error.status).toBe(HttpStatus.NOT_FOUND);
            }
        });
    });

    describe('delete', () => {
        it('should successfully delete a schedule', async () => {
            const id = 1;
            jest.spyOn(service, 'deleteS').mockResolvedValue(true);

            expect(await controller.delete(id)).toEqual({ message: 'Schedule deleted successfully' });
        });

        it('should handle errors during deletion', async () => {
            const id = 1;
            jest.spyOn(service, 'deleteS').mockRejectedValue(new Error('Deletion failed'));

            try {
                await controller.delete(id);
            } catch (error) {
                expect(error).toBeInstanceOf(HttpException);
                expect(error.response).toEqual({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Error deleting schedule',
                });
                expect(error.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });

        it('should handle case when schedule is not found for deletion', async () => {
            const id = 1;
            jest.spyOn(service, 'deleteS').mockResolvedValue(false);

            try {
                await controller.delete(id);
            } catch (error) {
                expect(error).toBeInstanceOf(HttpException);
                expect(error.response).toEqual({
                    status: HttpStatus.NOT_FOUND,
                    error: 'Schedule not found for deletion',
                });
                expect(error.status).toBe(HttpStatus.NOT_FOUND);
            }
        });
    });
});
