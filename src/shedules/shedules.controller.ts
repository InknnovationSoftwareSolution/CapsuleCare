import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { ShedulesService } from './shedules.service';
import { newShed, updatShed } from './shedelus.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('shedules')
export class ShedulesController {
    constructor(private readonly shedulesService: ShedulesService) {}

    @Post()
    async create(@Body() newShed: newShed) {
        try {
            return await this.shedulesService.createS(newShed);
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'Error creating schedule',
            }, HttpStatus.BAD_REQUEST);
        }
    }

    @Get()
    async findAll() {
        try {
            return await this.shedulesService.findAll();
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error retrieving schedules',
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        try {
            const schedule = await this.shedulesService.findShedules(id);
            if (!schedule) {
                throw new HttpException({
                    status: HttpStatus.NOT_FOUND,
                    error: 'Schedule not found',
                }, HttpStatus.NOT_FOUND);
            }
            return schedule;
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error retrieving schedule',
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() updateShed: updatShed) {
        try {
            const updatedSchedule = await this.shedulesService.updateS(id, updateShed);
            if (!updatedSchedule) {
                throw new HttpException({
                    status: HttpStatus.NOT_FOUND,
                    error: 'Schedule not found for update',
                }, HttpStatus.NOT_FOUND);
            }
            return updatedSchedule;
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error updating schedule',
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        try {
            const deleted = await this.shedulesService.deleteS(id);
            if (!deleted) {
                throw new HttpException({
                    status: HttpStatus.NOT_FOUND,
                    error: 'Schedule not found for deletion',
                }, HttpStatus.NOT_FOUND);
            }
            return { message: 'Schedule deleted successfully' };
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error deleting schedule',
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
