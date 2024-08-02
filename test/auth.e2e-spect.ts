import { INestApplication } from "@nestjs/common";
import * as request from 'supertest';
import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app.module";

describe('Acceder al perfil de usuario', () => {
    let app: INestApplication;

    beforeAll(async  () =>{
        const modulef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = modulef.createNestApplication();
        await app.init();
    })

    it(`/POST auth/login`, async () =>{
        const userTest = {
        }

        return request(app.getHttpServer())
            .post('')
            .send()
            .expect(200)
            .then(({body}) => {
                expect(body.user).toBeDefined();
                expect(body.user.email).toEqual(userTest);
                expect(body.access_token).toBeDefined();
                process.env.Token = body.access_token;
            })
    });

    it(`/GET auth/profile`, () =>{
        return request(app.getHttpServer())
        .get('/auth/profile')
        .expect(401);
    });

    it(`/GET auth/profile`, async() =>{
        return request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${process.env.Token}`)
        .expect(200)
        .then(({body})=>{
            expect(body.email).toEqual(process.env.Test_User);
        });
    })

    afterAll(async () =>{
        await app.close();
    })
});