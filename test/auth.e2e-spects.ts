/**import { INestApplication } from "@nestjs/common";
import * as request from 'supertest';
import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app.module";

describe('Acceder al usuario', () =>{
    let app: INestApplication;

    beforeAll(async () =>{
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    it(`/POST auth/login`, async () =>{
        const userTest ={
            username: process.env.TEST_USER,
            password: process.env.TEST_PWD
        };

        return request(app.getHttpServer())
        .post('/auth/login')
        .send(userTest)
        .expect(200)
        .then(({ body })=>{
            expect(body.user).toBeDefined();
            expect(body.user.email).toEqual(userTest.username);
            expect(body.access_token).toBeDefined();

            process.env.TOKEN = body.access_token;

        });
    });
})**/

import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { AuthModule } from '../src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../src/users/users.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<Users>;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: '',
            database: 'integradora',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true
        }),
        AuthModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userRepository = moduleFixture.get<Repository<Users>>(getRepositoryToken(Users));
    jwtService = moduleFixture.get<JwtService>(JwtService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('http://localhost:3000/auth/register (POST)', () => {
    it('debería registrar un nuevo usuario', async () => {
      const response = await request(app.getHttpServer())
        .post('../auth/register')
        .send({
          name: 'admin',
          email: 'admin@admin.com',
          password: 'admin',
        })
        .expect(201);

      const { access_token } = response.body;
      expect(access_token).toBeDefined();

      const user = await userRepository.findOne({ where: { email: 'admin@admin.com' } });
      expect(user).toBeDefined();
      expect(user.email).toBe('admin@admin.com');
    });
  });

  describe('http://localhost:3000/auth/login (POST)', () => {
    it('debería iniciar sesión con un usuario existente', async () => {
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = userRepository.create({
        userName: 'admin',
        email: 'admin@admin.com',
        password: hashedPassword,
      });
      await userRepository.save(user);

      const response = await request(app.getHttpServer())
        .post('http://localhost:3000/auth/login')
        .send({
          email: 'admin@admin.com',
          password,
        })
        .expect(200);

      const { access_token } = response.body;
      expect(access_token).toBeDefined();

      const decodedToken = jwtService.decode(access_token);
      expect(decodedToken).toHaveProperty('email', 'admin@admin.com');
    });

    it('debería devolver un error por credenciales inválidas', async () => {
      await request(app.getHttpServer())
        .post('http://localhost:3000/auth/login')
        .send({
          email: 'wrong@admin.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });
});
