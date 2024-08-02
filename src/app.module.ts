import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { MedicationsModule } from './medications/medications.module';
import { ShedulesModule } from './shedules/shedules.module';
import { NotificationsModule } from './notifications/notifications.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'username',
      password: 'root',
      database: 'integradora',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      schema: 'public',
    }),
    UsersModule, MedicationsModule, ShedulesModule, NotificationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
