import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from '../src/users/users.module';
import { AuthModule } from '../src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../src/users/users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let userRepository: Repository<Users>;
  let token: string;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'root',
          password: '',
          database: 'integradora',
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          synchronize: true,
          logging: true
        }),
        UsersModule,
        AuthModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    jwtService = moduleRef.get<JwtService>(JwtService);
    userRepository = moduleRef.get<Repository<Users>>(getRepositoryToken(Users));
  });

  beforeEach(async () => {
    await userRepository.clear(); // Clean up the database before each test

    const user = await userRepository.save({
      userName: 'testuser',
      email: 'testuser@example.com',
      password: 'password123',
    });

    const loginResponse = await request(app.getHttpServer())
      .post('/users/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123',
      });

    token = loginResponse.body.access_token;
  });

  it('/users/register (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/users/register')
      .send({
        userName: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
        // Remove or adjust fields that may not be necessary or are handled differently
      })
      .expect(201);

    expect(response.body).toHaveProperty('access_token');
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user.userName).toBe('newuser');
    expect(response.body.user.email).toBe('newuser@example.com');
  });

  it('/users/login (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/users/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123',
      })
      .expect(200);

    expect(response.body).toHaveProperty('access_token');
  });

  it('/users (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty('userName');
    expect(response.body[0]).toHaveProperty('email');
  });

  it('/users/:id (PATCH)', async () => {
    const users = await userRepository.findOne({ where: { email: 'testuser@example.com' } });

    if (!users) {
      throw new Error('User not found');
    }

    const response = await request(app.getHttpServer())
      .patch(`/users/${users.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ userName: 'updateduser' })
      .expect(200);

    expect(response.body).toEqual({});
  });

  it('/users/:id (DELETE)', async () => {
    const users = await userRepository.findOne({ where: { email: 'testuser@example.com' } });

    if (!users) {
      throw new Error('User not found');
    }

    const response = await request(app.getHttpServer())
      .delete(`/users/${users.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.text).toBe('User deleted');
  });

  afterAll(async () => {
    await app.close();
  });
});
