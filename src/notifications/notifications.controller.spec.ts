import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { newNotificacion } from './notifications.dto';
import { Updatnotif } from './notificationss.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('NotificationsController', () => {
    let controller: NotificationsController;
    let service: NotificationsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [NotificationsController],
            providers: [
                {
                    provide: NotificationsService,
                    useValue: {
                        createN: jest.fn(),
                        findAll: jest.fn(),
                        findNotification: jest.fn(),
                        updateN: jest.fn(),
                        deleteN: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<NotificationsController>(NotificationsController);
        service = module.get<NotificationsService>(NotificationsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('agregarN', () => {
        it('should successfully add a notification', async () => {
            const newNotification: newNotificacion = { /* Add properties here */ };
            jest.spyOn(service, 'createN').mockResolvedValue('Notification added');

            expect(await controller.agregarN(newNotification)).toBe('Notification added');
        });

        it('should handle errors during addition', async () => {
            const newNotification: newNotificacion = { /* Add properties here */ };
            jest.spyOn(service, 'createN').mockRejectedValue(new Error('Addition failed'));

            try {
                await controller.agregarN(newNotification);
            } catch (error) {
                expect(error).toBeInstanceOf(HttpException);
                expect(error.response).toEqual({
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Error adding notification',
                });
                expect(error.status).toBe(HttpStatus.BAD_REQUEST);
            }
        });
    });

    describe('getAll', () => {
        it('should successfully retrieve all notifications', async () => {
            jest.spyOn(service, 'findAll').mockResolvedValue(['Notification1', 'Notification2']);

            expect(await controller.getAll()).toEqual(['Notification1', 'Notification2']);
        });

        it('should handle errors during retrieval', async () => {
            jest.spyOn(service, 'findAll').mockRejectedValue(new Error('Retrieval failed'));

            try {
                await controller.getAll();
            } catch (error) {
                expect(error).toBeInstanceOf(HttpException);
                expect(error.response).toEqual({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Error retrieving notifications',
                });
                expect(error.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
    });

    describe('findNotif', () => {
        it('should successfully retrieve a notification by ID', async () => {
            const id = 1;
            jest.spyOn(service, 'findNotification').mockResolvedValue({ id, message: 'Notification1' });

            expect(await controller.findNotif(id)).toEqual({ id, message: 'Notification1' });
        });

        it('should handle errors during retrieval', async () => {
            const id = 1;
            jest.spyOn(service, 'findNotification').mockRejectedValue(new Error('Retrieval failed'));

            try {
                await controller.findNotif(id);
            } catch (error) {
                expect(error).toBeInstanceOf(HttpException);
                expect(error.response).toEqual({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Error retrieving notification',
                });
                expect(error.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });

        it('should handle case when notification is not found', async () => {
            const id = 1;
            jest.spyOn(service, 'findNotification').mockResolvedValue(null);

            try {
                await controller.findNotif(id);
            } catch (error) {
                expect(error).toBeInstanceOf(HttpException);
                expect(error.response).toEqual({
                    status: HttpStatus.NOT_FOUND,
                    error: 'Notification not found',
                });
                expect(error.status).toBe(HttpStatus.NOT_FOUND);
            }
        });
    });

    describe('actualizN', () => {
        it('should successfully update a notification', async () => {
            const id = 1;
            const updateNotif: Updatnotif = { /* Add properties here */ };
            jest.spyOn(service, 'updateN').mockResolvedValue({ id, ...updateNotif });

            expect(await controller.actualizN(id, updateNotif)).toEqual({ id, ...updateNotif });
        });

        it('should handle errors during update', async () => {
            const id = 1;
            const updateNotif: Updatnotif = { /* Add properties here */ };
            jest.spyOn(service, 'updateN').mockRejectedValue(new Error('Update failed'));

            try {
                await controller.actualizN(id, updateNotif);
            } catch (error) {
                expect(error).toBeInstanceOf(HttpException);
                expect(error.response).toEqual({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Error updating notification',
                });
                expect(error.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });

        it('should handle case when notification is not found for update', async () => {
            const id = 1;
            const updateNotif: Updatnotif = { /* Add properties here */ };
            jest.spyOn(service, 'updateN').mockResolvedValue(null);

            try {
                await controller.actualizN(id, updateNotif);
            } catch (error) {
                expect(error).toBeInstanceOf(HttpException);
                expect(error.response).toEqual({
                    status: HttpStatus.NOT_FOUND,
                    error: 'Notification not found for update',
                });
                expect(error.status).toBe(HttpStatus.NOT_FOUND);
            }
        });
    });

    describe('deletNotif', () => {
        it('should successfully delete a notification', async () => {
            const id = 1;
            jest.spyOn(service, 'deleteN').mockResolvedValue(true);

            expect(await controller.deletNotif(id)).toEqual({ message: 'Notification deleted successfully' });
        });

        it('should handle errors during deletion', async () => {
            const id = 1;
            jest.spyOn(service, 'deleteN').mockRejectedValue(new Error('Deletion failed'));

            try {
                await controller.deletNotif(id);
            } catch (error) {
                expect(error).toBeInstanceOf(HttpException);
                expect(error.response).toEqual({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Error deleting notification',
                });
                expect(error.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });

        it('should handle case when notification is not found for deletion', async () => {
            const id = 1;
            jest.spyOn(service, 'deleteN').mockResolvedValue(false);

            try {
                await controller.deletNotif(id);
            } catch (error) {
                expect(error).toBeInstanceOf(HttpException);
                expect(error.response).toEqual({
                    status: HttpStatus.NOT_FOUND,
                    error: 'Notification not found for deletion',
                });
                expect(error.status).toBe(HttpStatus.NOT_FOUND);
            }
        });
    });
});
