import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createNestApplication, getAuthHeaderName, getAuthHeaderValue, v1Endpoints } from './inc/test-utils';
import * as UserExample from './data/user.json';
import { doingSignIn, doingSignUp } from './inc/common_op';
import { UserEntity } from '@/shared/entities/user.entity';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createNestApplication();
  });

  describe('/v1/auth/sign-up (POST)', () => {
    const endpoint = '/v1/auth/sign-up';

    it('endpoint is valid', async () => {
      const { status } = await request(app.getHttpServer()).post(endpoint);

      expect(status).not.toBe(404);
    });

    it('get error in empty body', async () => {
      await request(app.getHttpServer()).post(endpoint).expect(400);
    });

    it('email must not be empty', async () => {
      const data = { ...UserExample };
      data.email = '';
      await request(app.getHttpServer()).post(endpoint).send(data).expect(400);
    });

    it('email must be valid', async () => {
      const data = { ...UserExample };
      data.email = 'testgmail.com';
      await request(app.getHttpServer()).post(endpoint).send(data).expect(400);
    });

    it('name must not be empty', async () => {
      const data = { ...UserExample };
      data.name = '';
      await request(app.getHttpServer()).post(endpoint).send(data).expect(400);
    });

    it('password must not be empty', async () => {
      const data = { ...UserExample };
      data.password = '';
      await request(app.getHttpServer()).post(endpoint).send(data).expect(400);
    });

    it('The password must contain at least one lowercase and uppercase letter, numbers, and at least one special character', async () => {
      const data = { ...UserExample };
      data.password = 'sdfk34234KK';
      await request(app.getHttpServer()).post(endpoint).send(data).expect(400);
    });

    it('email already registered', async () => {
      await request(app.getHttpServer()).post(endpoint).send(UserExample).expect(201);
      await request(app.getHttpServer()).post(endpoint).send(UserExample).expect(400);
    });

    it('doing signup', async () => {
      const { body } = await request(app.getHttpServer()).post(endpoint).send(UserExample).expect(201);

      expect(body.result).toBe(true);
    });
  });

  describe('/v1/auth/sign-in (POST)', () => {
    const endpoint = '/v1/auth/sign-in';
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
      await doingSignUp(app, UserExample);

      await request(app.getHttpServer()).post(endpoint).send({
        email: 'example@gmail.com',
        password: 'kj23uksdjf',
      }).expect(401);
    });


    it('do sign in', async () => {
      // first doing signup
      await doingSignUp(app, UserExample);

      const { body } = await request(app.getHttpServer()).post(endpoint).send(exampleData).expect(201);

      expect(body.id).toBeTruthy();
      expect(body.email).toBe(UserExample.email);
      expect(body.name).toBe(UserExample.name);
      expect(body.token).toBeTruthy();
      expect(body.refreshToken).toBeTruthy();
    });
  })

  describe('/v1/auth/sign-out (GET)', () => {
    const endpoint = '/v1/auth/sign-out';
    const exampleData = {
      email: UserExample.email,
      password: UserExample.password,
    };

    it('endpoint is valid', async () => {
      const { status } = await request(app.getHttpServer()).get(endpoint);

      expect(status).not.toBe(404);
    });

    it('token must be set in header', async () => {
      await request(app.getHttpServer()).get(endpoint).expect(401);
    });

    it('must set JWT token on header', async () => {
      // first doing signin
      await doingSignIn(app, UserExample, exampleData);

      await request(app.getHttpServer()).get(endpoint).set("Authorization", ``).send(exampleData).expect(401);
    });

    it('do sign in', async () => {
      // first doing signin
      const { body } = await doingSignIn(app, UserExample, exampleData);

      expect(body.token).toBeTruthy();
      await request(app.getHttpServer()).get(endpoint).set("Authorization", `Bearer ${body.token}`).send(exampleData).expect(200);
    });
  })

  describe('/v1/auth/refresh-token (POST)', () => {
    const endpoint = '/v1/auth/refresh-token';
    let token, refreshToken;
    const exampleData = {
      email: UserExample.email,
      password: UserExample.password,
    };

    beforeEach(async () => {
      const { body } = await doingSignIn(app, UserExample, exampleData);
      token = body.token;
      refreshToken = body.refreshToken;
    })

    it('endpoint is valid', async () => {
      const { status } = await request(app.getHttpServer()).post(endpoint);

      expect(status).not.toBe(404);
    });

    it('get error in empty body', async () => {
      await request(app.getHttpServer()).post(endpoint).expect(401);
    });

    it('get unauthorized when refresh token is invalid', async () => {
      await request(app.getHttpServer()).post(endpoint).set(getAuthHeaderName(), getAuthHeaderValue(token)).expect(401);
    });

    it('refresh token', async () => {
      const { body } = await request(app.getHttpServer()).post(endpoint).send({ refreshToken }).expect(201);

      expect(body.id).toBeTruthy();
      expect(body.token).toBeTruthy();
      expect(body.refreshToken).toBeTruthy();

      // check new tokens
      await request(app.getHttpServer()).post(endpoint).send({ refreshToken: body.refreshToken }).expect(201);
      await request(app.getHttpServer()).get(v1Endpoints.signOut).set(getAuthHeaderName(), getAuthHeaderValue(body.token)).expect(200);
    });
  })


  describe('/v1/auth/reset-password (POST)', () => {
    const endpoint = '/v1/auth/reset-password';
    const exampleData = {
      email: UserExample.email,
    };

    it('endpoint is valid', async () => {
      const { status } = await request(app.getHttpServer()).patch(endpoint);

      expect(status).not.toBe(404);
    });

    it('get error in empty body', async () => {
      await request(app.getHttpServer()).patch(endpoint).expect(400);
    });

    it('email address must be valid', async () => {
      await request(app.getHttpServer())
        .patch(endpoint)
        .send({ email: 'examplatgmail.com' }).expect(400);
    });

    it('email has not found', async () => {
      const { body } = await request(app.getHttpServer())
        .patch(endpoint)
        .send({
          email: exampleData.email
        }).expect(404);
    });

    it('register reset password request', async () => {
      await doingSignUp(app, UserExample);

      await request(app.getHttpServer())
        .patch(endpoint)
        .send({
          email: exampleData.email
        }).expect(200);
    });
  })
});
