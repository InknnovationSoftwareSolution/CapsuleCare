import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { updateUser, usersNew } from './users.dto';
import { UsersService } from './users.service';
import { Users } from './users.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly UsersServ: UsersService) {}

    @Post()
    insert(@Body() User: usersNew){
        return this.UsersServ.agregarUser(User)
    }

    @Get()
    Find(): Promise<Users[]>{
        return this.UsersServ.getUsers();
    }

    @Get(':id')
    FindOne(@Param('id', ParseIntPipe) id: number): Promise<Users>{
        return this.UsersServ.FindUser(id);
    }

    @Patch(':id')
    updateUser(@Param('id', ParseIntPipe) id: number,  @Body() updatU: updateUser){
        return this.UsersServ.UpdateUser(id, updatU)
    }

    @Delete(':id')
    deleteUser(@Param('id', ParseIntPipe) id: number){
        return this.UsersServ.DeleteUser(id)
    }
}
