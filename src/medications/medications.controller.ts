import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { MedicationsService } from './medications.service';
import { Newmedicina, Updatmedicina } from './medications.dto';

@Controller('medications')
export class MedicationsController {
    constructor(private readonly MServ: MedicationsService) {}

    @Post()
    agregarM(@Body() medicina: Newmedicina){
        return this.MServ.createM(medicina)
    }

    @Get()
    getAll(){
        return this.MServ.findAll();
    }

    @Get(':id')
    findMedic(@Param('id', ParseIntPipe) id: number){
        return this.MServ.findMedicina(id)    
    }

    @Patch(':id')
    actualizM(@Param('id', ParseIntPipe) id: number, @Body() updatU: Updatmedicina){
        return this.MServ.updateM(id, updatU)
    }

}
