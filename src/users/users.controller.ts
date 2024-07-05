import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { updateUser, usersNew } from './users.dto';
import { UsersService } from './users.service';
import { Users } from './users.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';



@Controller('users')
export class UsersController {
    constructor(private readonly UsersServ: UsersService) {}

    @Post()
    insert(@Body() User: usersNew){
        return this.UsersServ.agregarUser(User)
    }

    @Get()
    Find(){
        return this.UsersServ.getUsers();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number){
        return this.UsersServ.findUser(id)
    }

    @Patch(':id')
    updateUser(@Param('id', ParseIntPipe) id: number,  @Body() updatU: updateUser){
        return this.UsersServ.updateUser(id, updatU)
    }

    @Delete(':id')
    deleteUser(@Param('id', ParseIntPipe) id: number){
        return this.UsersServ.deleteUser(id)
    }
}
