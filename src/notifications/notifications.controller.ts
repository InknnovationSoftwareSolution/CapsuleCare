import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { newNotificacion } from './notifications.dto';
import { Updatnotif } from './notificationss.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
    constructor(private readonly NServ: NotificationsService) {}

    @Post()
    async agregarN(@Body() Notific: newNotificacion) {
        try {
            return await this.NServ.createN(Notific);
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'Error adding notification',
            }, HttpStatus.BAD_REQUEST);
        }
    }

    @Get()
    async getAll() {
        try {
            return await this.NServ.findAll();
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error retrieving notifications',
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':id')
    async findNotif(@Param('id', ParseIntPipe) id: number) {
        try {
            const notification = await this.NServ.findNotification(id);
            if (!notification) {
                throw new HttpException({
                    status: HttpStatus.NOT_FOUND,
                    error: 'Notification not found',
                }, HttpStatus.NOT_FOUND);
            }
            return notification;
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error retrieving notification',
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Patch(':id')
    async actualizN(@Param('id', ParseIntPipe) id: number, @Body() updatU: Updatnotif) {
        try {
            const updated = await this.NServ.updateN(id, updatU);
            if (!updated) {
                throw new HttpException({
                    status: HttpStatus.NOT_FOUND,
                    error: 'Notification not found for update',
                }, HttpStatus.NOT_FOUND);
            }
            return updated;
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error updating notification',
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':id')
    async deletNotif(@Param('id', ParseIntPipe) id: number) {
        try {
            const deleted = await this.NServ.deleteN(id);
            if (!deleted) {
                throw new HttpException({
                    status: HttpStatus.NOT_FOUND,
                    error: 'Notification not found for deletion',
                }, HttpStatus.NOT_FOUND);
            }
            return { message: 'Notification deleted successfully' };
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error deleting notification',
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
