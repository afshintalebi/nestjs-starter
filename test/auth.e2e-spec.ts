import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createNestApplication } from './test-utils';
import * as UserExample from './data/user.json';
import { doSignUp } from './common_op';
import { UserEntity } from '@/shared/entities/user.entity';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createNestApplication();
  });

  describe('/v1/auth/sign-up (POST)', () => {
    const endpoint = '/v1/auth/sign-up';
    const exampleData = { ...UserExample };

    it('endpoint is valid', async () => {
      const { status } = await request(app.getHttpServer()).post(endpoint);

      expect(status).not.toBe(404);
    });

    it('get error in empty body', async () => {
      await request(app.getHttpServer()).post(endpoint).expect(400);
    });

    it('email must not be empty', async () => {
      const data = { ...exampleData };
      data.email = '';
      await request(app.getHttpServer()).post(endpoint).send(data).expect(400);
    });

    it('email must be valid', async () => {
      const data = { ...exampleData };
      data.email = 'testgmail.com';
      await request(app.getHttpServer()).post(endpoint).send(data).expect(400);
    });

    it('name must not be empty', async () => {
      const data = { ...exampleData };
      data.name = '';
      await request(app.getHttpServer()).post(endpoint).send(data).expect(400);
    });

    it('password must not be empty', async () => {
      const data = { ...exampleData };
      data.password = '';
      await request(app.getHttpServer()).post(endpoint).send(data).expect(400);
    });

    it('The password must contain at least one lowercase and uppercase letter, numbers, and at least one special character', async () => {
      const data = { ...exampleData };
      data.password = 'sdfk34234KK';
      await request(app.getHttpServer()).post(endpoint).send(data).expect(400);
    });

    it('email already registered', async () => {
      await request(app.getHttpServer()).post(endpoint).send(exampleData).expect(201);
      await request(app.getHttpServer()).post(endpoint).send(exampleData).expect(400);
    });

    it('doing signup', async () => {
      const { body } = await request(app.getHttpServer()).post(endpoint).send(exampleData).expect(201);

      expect(body.result).toBe(true);
    });
  });

  describe('/v1/auth/sign-in (POST)', () => {
    const endpoint = '/v1/auth/sign-in';
    const validData = { ...UserExample }
    const exampleData = {
      email: UserExample.email,
      password: UserExample.password,
    };

    it('endpoint is valid', async () => {
      const { status } = await request(app.getHttpServer()).post(endpoint);

      expect(status).not.toBe(404);
    });

    it('get error in empty body', async () => {
      await request(app.getHttpServer()).post(endpoint).expect(401);
    });

    it('email must not be empty', async () => {
      const data = { ...exampleData };
      data.email = '';
      await request(app.getHttpServer()).post(endpoint).send(data).expect(401);
    });

    it('email must not be valid', async () => {
      const data = { ...exampleData };
      data.email = 'email.example.com';
      await request(app.getHttpServer()).post(endpoint).send(data).expect(401);
    });

    it('password must not be empty', async () => {
      const data = { ...exampleData };
      data.password = '';
      await request(app.getHttpServer()).post(endpoint).send(data).expect(401);
    });

    it('wrong sign in data', async () => {
      // first doing signup
      await doSignUp(app, validData);

      await request(app.getHttpServer()).post(endpoint).send({
        email: 'example@gmail.com',
        password: 'kj23uksdjf',
      }).expect(401);
    });


    it('do sign in', async () => {
      // first doing signup
      await doSignUp(app, validData);

      const { body } = await request(app.getHttpServer()).post(endpoint).send(exampleData).expect(201);

      expect(body.id).toBeTruthy();
      expect(body.email).toBe(validData.email);
      expect(body.name).toBe(validData.name);
      expect(body.token).toBeTruthy();
      expect(body.refreshToken).toBeTruthy();
    });
  })
});
