import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { updateUser, usersNew } from './users.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LoginUserDto } from '../auth/dto/login-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly UsersServ: UsersService) {}

    @Post('register')
    async register(@Body() user: usersNew) {
        try {
            const registrationResult = await this.UsersServ.register(user);
            return registrationResult;
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'Error registering user',
            }, HttpStatus.BAD_REQUEST);
        }
    }

    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto) {
        try {
            return await this.UsersServ.login(loginUserDto);
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.UNAUTHORIZED,
                error: 'Invalid credentials',
            }, HttpStatus.UNAUTHORIZED);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async insert(@Body() User: usersNew) {
        try {
            return await this.UsersServ.agregarUser(User);
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'Error adding user',
            }, HttpStatus.BAD_REQUEST);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async Find() {
        try {
            return await this.UsersServ.getUsers();
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error retrieving users',
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        try {
            const user = await this.UsersServ.findUser(id);
            if (!user) {
                throw new HttpException({
                    status: HttpStatus.NOT_FOUND,
                    error: 'User not found',
                }, HttpStatus.NOT_FOUND);
            }
            return user;
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error retrieving user',
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async updateUser(@Param('id', ParseIntPipe) id: number, @Body() updatU: updateUser) {
        try {
            const updatedUser = await this.UsersServ.updateUser(id, updatU);
            if (!updatedUser) {
                throw new HttpException({
                    status: HttpStatus.NOT_FOUND,
                    error: 'User not found for update',
                }, HttpStatus.NOT_FOUND);
            }
            return updatedUser;
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error updating user',
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteUser(@Param('id', ParseIntPipe) id: number) {
        try {
            const deleted = await this.UsersServ.deleteUser(id);
            if (!deleted) {
                throw new HttpException({
                    status: HttpStatus.NOT_FOUND,
                    error: 'User not found for deletion',
                }, HttpStatus.NOT_FOUND);
            }
            return { message: 'User deleted successfully' };
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error deleting user',
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
