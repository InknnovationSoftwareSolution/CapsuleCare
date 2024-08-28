import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { updateUser, usersNew } from './users.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LoginUserDto } from '../auth/dto/login-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly UsersServ: UsersService) {}

    @ApiOperation({ summary: 'Nuevo usuario' })
    @ApiResponse({ status: 201, description: 'Usuario creado' })
    @ApiResponse({ status: 400, description: 'No accesible' })
    @Post()
    insert(@Body() User: usersNew){
        return this.UsersServ.agregarUser(User);
    }

    @ApiOperation({ summary: 'Lista de usuarios' })
    @ApiResponse({ status: 200, description: 'Todos los usuarios' })
    @ApiResponse({ status: 404, description: 'No accesible' })
    @Get()
    Find(){
        return this.UsersServ.getUsers();
    }

    @ApiOperation({ summary: 'Buscar usuario por Id' })
    @ApiResponse({ status: 200, description: 'Usuario buscado' })
    @ApiResponse({ status: 404, description: 'No accesible' })
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number){
        return this.UsersServ.findUser(id);
    }

    @ApiOperation({ summary: 'Actualizar usuario por Id' })
    @ApiResponse({ status: 200, description: 'Usuario actualizado' })
    @ApiResponse({ status: 404, description: 'No accesible' })
    @Patch(':id')
    updateUser(@Param('id', ParseIntPipe) id: number,  @Body() updatU: updateUser){
        return this.UsersServ.updateUser(id, updatU);
    }

    @ApiOperation({ summary: 'Eliminacion de usuario por Id' })
    @ApiResponse({ status: 201, description: 'Usuario eliminado' })
    @ApiResponse({ status: 400, description: 'No accesible' })
    @Delete(':id')
    deleteUser(@Param('id', ParseIntPipe) id: number){
        return this.UsersServ.deleteUser(id);
    }
}
