import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

ApiTags('/');
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Hola mundo' })
  @ApiResponse({ status: 201, description: 'Hola mundo' })
  @ApiResponse({ status: 400, description: 'not found' })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
