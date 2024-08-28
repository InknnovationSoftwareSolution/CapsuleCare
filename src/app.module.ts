import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { MedicationsModule } from './medications/medications.module';
import { ShedulesModule } from './shedules/shedules.module';
import { NotificationsModule } from './notifications/notifications.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

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

      // type: 'mysql',
      // host: 'localhost',
      // port: 3306,
      // username: 'root',
      // password: '',
      // database: 'integrador',
      // entities: [__dirname + '/**/*.entity{.ts,.js}'],
      // synchronize: true,
    }),
    UsersModule, MedicationsModule, ShedulesModule, NotificationsModule,AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}