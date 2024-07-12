import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller('app')
export class AppController {
  getHello(): any {
    throw new Error('Method not implemented.');
  }
  @UseGuards(JwtAuthGuard)
  @Get('secure-endpoint')
  getSecureData() {
    return "This is a secure data";
  }

  @Get('public-endpoint')
  getPublicData() {
    return "This is public data";
  }
}
