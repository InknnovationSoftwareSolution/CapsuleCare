import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Acceder al perfil de usuario', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  //login test
  it('POST: /auth/login', async () => {

    const userTest = {
      username: process.env.TEST_USER,
      password: process.env.TEST_PWD
    };

    return request(app.getHttpServer())
      .post('/auth/login')
      .send(userTest)
      .expect(200)
      .then(({ body }) => {
        //console.log(body);
        process.env.TOKEN = body.access_token;

        expect(body.user).toBeDefined();
        expect(body.user.email).toEqual(userTest.username);
        expect(body.access_token).toBeDefined();
      });
  });

  //usuario no autorizado
  it(`No permitir acceso al usuario no identificado`, async () => {
    return request(app.getHttpServer())
      .get('/auth/profile')
      .expect(401);
  });

  //perfil de usuario
  it(`Leer perfil de usuario: GET: auth/profile`, async () => {
    return request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      .expect(200)
      .then(({ body }) => {
        //console.log(body);
        expect(body.email).toEqual(process.env.TEST_USER);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
