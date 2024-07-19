import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.authService.register(createUserDto);
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
      return await this.authService.login(loginUserDto);
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        error: 'Invalid credentials',
      }, HttpStatus.UNAUTHORIZED);
    }
  }
}
