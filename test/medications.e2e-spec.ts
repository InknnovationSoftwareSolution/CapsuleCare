import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Medications E2E Test', () => {
  let app: INestApplication;
  let jwtToken: string;
  let medicationId: number;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInN1YiI6NCwiaWF0IjoxNzI0ODAxMDE2LCJleHAiOjE3MjQ4MDQ2MTZ9.S_WMmOLgVBhfD3avXD2nYN5zWWWfiyaIda0LpFtqsYc';
  });

  it('POST: /medications should create a medication and return it', async () => {
    const response = await request(app.getHttpServer())
      .post('/medications')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        name: 'Paracetamol',
        quantity: 20,
        user: 1,
      })
      .expect(201);

    medicationId = response.body.id;

    expect(response.body.id).toBeDefined();
    expect(response.body.name).toEqual('Paracetamol');
  });

  it('GET: /medications should return all medications', async () => {
    const response = await request(app.getHttpServer())
      .get('/medications')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('GET: /medications/:id should return a specific medication', async () => {
    const response = await request(app.getHttpServer())
      .get(`/medications/${medicationId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(response.body.id).toEqual(medicationId);
    expect(response.body.name).toEqual('Paracetamol');
  });

  it('PATCH: /medications/:id should update the medication and return it', async () => {
    await request(app.getHttpServer())
      .patch(`/medications/${medicationId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        name: 'Ibuprofeno',
        quantity: 10,
      })
      .expect(200);
  
    const response = await request(app.getHttpServer())
      .get(`/medications/${medicationId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);
  
    expect(response.body.name).toEqual('Ibuprofeno');
    expect(response.body.quantity).toEqual(10);
  });
  

  it('DELETE: /medications/:id should delete the medication', async () => {
    await request(app.getHttpServer())
      .delete(`/medications/${medicationId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/medications/${medicationId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(404);
  });

  afterAll(async () => {
    await app.close();
  });
});