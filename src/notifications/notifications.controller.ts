import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { newNotificacion } from './notifications.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Updatnotif } from './notificationss.dto';

@ApiTags('Notificacions')
@Controller('notifications')
export class NotificationsController {
    constructor(private readonly NServ: NotificationsService) {}

    @ApiOperation({ summary: 'Nueva notificacion' })
    @ApiResponse({ status: 201, description: 'Nueva notificacion' })
    @ApiResponse({ status: 400, description: 'No accesible' })
    @Post()
    agregarN(@Body() Notific: newNotificacion){
        return this.NServ.createN(Notific)
    }

    @ApiOperation({ summary: 'Lista de notificaciones' })
    @ApiResponse({ status: 200, description: 'Notificaciones' })
    @ApiResponse({ status:404, description: 'No accesible' })
    @Get()
    getAll(){
        return this.NServ.findAll();
    }

    @ApiOperation({ summary: 'Buscar notificacion por Id' })
    @ApiResponse({ status: 200, description: 'Notificacion por Id' })
    @ApiResponse({ status: 404, description: 'No accesible' })
    @Get(':id')
    findNotif(@Param('id', ParseIntPipe) id: number){
        return this.NServ.findNotification(id)
    }

    @ApiOperation({ summary: 'Actualizar notificaciones por Id' })
    @ApiResponse({ status: 200, description: 'Notificaion actualizada' })
    @ApiResponse({ status: 404, description: 'No accesible' })
    @Patch(':id')
    actualizN(@Param('id', ParseIntPipe) id: number,  @Body() updatU: Updatnotif){
        return this.NServ.updateN(id, updatU)
    }

    @ApiOperation({ summary: 'Eliminar notificacion por Id' })
    @ApiResponse({ status: 201, description: 'Notificacion eliminada' })
    @ApiResponse({ status: 400, description: 'No accesible' })
    @Delete(':id')
    deletNotif(@Param('id', ParseIntPipe) id: number){
        return this.NServ.deleteN(id)
    }
}
