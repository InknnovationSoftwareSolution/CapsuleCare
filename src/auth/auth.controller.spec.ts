import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { MedicationsService } from './medications.service';
import { Newmedicina, Updatmedicina } from './medications.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('medications')
export class MedicationsController {
    constructor(private readonly MServ: MedicationsService) {}

    @Post()
    async agregarM(@Body() medicina: Newmedicina) {
        try {
            return await this.MServ.createM(medicina);
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'Error adding medication',
            }, HttpStatus.BAD_REQUEST);
        }
    }

    @Get()
    async getAll() {
        try {
            return await this.MServ.findAll();
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error retrieving medications',
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':id')
    async findMedic(@Param('id', ParseIntPipe) id: number) {
        try {
            const medicina = await this.MServ.findMedicina(id);
            if (!medicina) {
                throw new HttpException({
                    status: HttpStatus.NOT_FOUND,
                    error: 'Medication not found',
                }, HttpStatus.NOT_FOUND);
            }
            return medicina;
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error retrieving medication',
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Patch(':id')
    async actualizM(@Param('id', ParseIntPipe) id: number, @Body() updatU: Updatmedicina) {
        try {
            const updated = await this.MServ.updateM(id, updatU);
            if (!updated) {
                throw new HttpException({
                    status: HttpStatus.NOT_FOUND,
                    error: 'Medication not found for update',
                }, HttpStatus.NOT_FOUND);
            }
            return updated;
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error updating medication',
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
