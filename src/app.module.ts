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
      username: 'process.env.DB_USER',
      password: 'process.env.PASSWORD',
      database: 'process.env.DB_NAME',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true
    }),
    UsersModule, MedicationsModule, ShedulesModule, NotificationsModule],
  controllers: [AppController],
  providers: [AppService, MedicationsService],
})
export class AppModule {}
