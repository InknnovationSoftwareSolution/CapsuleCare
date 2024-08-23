import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { MedicationsService } from './medications.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Newmedicina, Updatmedicina } from './medications.dto';

@ApiTags('Medicinas')
@Controller('medications')
export class MedicationsController {
    constructor(private readonly MServ: MedicationsService) {}

    @ApiOperation({ summary: 'Nueva medicina' })
    @ApiResponse({ status: 201, description: 'Nueva Medicina' })
    @ApiResponse({ status: 400, description: 'No accesible' })
    @Post()
    agregarM(@Body() medicina: Newmedicina){
        return this.MServ.createM(medicina)
    }

    @ApiOperation({ summary: 'Lista de medicinas' })
    @ApiResponse({ status: 200, description: 'Medicinas' })
    @ApiResponse({ status: 404, description: 'No accesible' })
    @Get()
    getAll(){
        return this.MServ.findAll();
    }

    @ApiOperation({ summary: 'Busqueda de medicina por Id' })
    @ApiResponse({ status: 200, description: 'Medicina por Id' })
    @ApiResponse({ status: 404, description: 'No accesible' })
    @Get(':id')
    findMedic(@Param('id', ParseIntPipe) id: number){
        return this.MServ.findMedicina(id)    
    }

    @ApiOperation({ summary: 'Eliminar medicina por Id' })
    @ApiResponse({ status: 201, description: 'Eliminado por Id' })
    @ApiResponse({ status: 400, description: 'No accesible' })
    @Patch(':id')
    actualizM(@Param('id', ParseIntPipe) id: number, @Body() updatU: Updatmedicina){
        return this.MServ.updateM(id, updatU)
    }

}
