import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MedicationsService } from './medications/medications.service';
import { MedicationsModule } from './medications/medications.module';
import { ShedulesModule } from './shedules/shedules.module';
import { NotificationsModule } from './notifications/notifications.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: '',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true
    }),
    UsersModule, MedicationsModule, ShedulesModule, NotificationsModule],
  controllers: [AppController],
  providers: [AppService, MedicationsService],
})
export class AppModule {}
