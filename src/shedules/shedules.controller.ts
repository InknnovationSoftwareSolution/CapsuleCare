import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ShedulesService } from './shedules.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { newShed, updatShed } from './shedelus.dto';

@ApiTags('Alarmas')
@Controller('shedules')
export class ShedulesController {
    constructor(private readonly shedulesService: ShedulesService) {}

    @ApiOperation({ summary: 'creacion de alarma' })
    @ApiResponse({ status: 201, description: 'nueva alarma' })
    @ApiResponse({ status: 400, description: 'No accesible' })
    @Post()
    create(@Body() newShed: newShed) {
        return this.shedulesService.createS(newShed);
    }

    @ApiOperation({ summary: 'Lista de alarmas' })
    @ApiResponse({ status: 200, description: 'Todas las alarmas' })
    @ApiResponse({ status: 404, description: 'No accesible' })
    @Get()
    findAll() {
        return this.shedulesService.findAll();
    }

    @ApiOperation({ summary: 'Buscar alarma por Id' })
    @ApiResponse({ status: 200, description: 'Alarma por Id' })
    @ApiResponse({ status: 404, description: 'No accesible' })
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.shedulesService.findShedules(id);
    }

    @ApiOperation({ summary: 'Actualizar alarma por Id' })
    @ApiResponse({ status: 200, description: 'Actuzlizado por Id' })
    @ApiResponse({ status: 404, description: 'No accesible' })
    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateShed: updatShed) {
        return this.shedulesService.updateS(id, updateShed);
    }

    @ApiOperation({ summary: 'Eliminacion de alarma por Id' })
    @ApiResponse({ status: 201, description: 'Eliminado por Id' })
    @ApiResponse({ status: 400, description: 'No accesible' })
    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.shedulesService.deleteS(id);
    }
}