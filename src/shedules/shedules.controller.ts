import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ShedulesService } from './shedules.service';
import { newShed, updatShed } from './shedelus.dto';

@Controller('shedules')
export class ShedulesController {
    constructor(private readonly SServ: ShedulesService) {}

    @Post()
    insert(@Body() User: newShed){
        return this.SServ.createS(User)
    }

    @Get()
    Find(){
        return this.SServ.findAll()
    }

    @Get(':id')
    FindOne(@Param('id', ParseIntPipe) id: number){
        return this.SServ.findShedules(id)
    }

    // @Patch(':id')
    // updateUser(@Param('id', ParseIntPipe) id: number,  @Body() updatU: updatShed){
    //     return this.SServ
    // }

    @Delete(':id')
    deleteUser(@Param('id', ParseIntPipe) id: number){
        return this.SServ.deleteS(id)
    }
}
