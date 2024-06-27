import { Module } from '@nestjs/common';
import { ShedulesService } from './shedules.service';

@Module({
  providers: [ShedulesService]
})
export class ShedulesModule {}
