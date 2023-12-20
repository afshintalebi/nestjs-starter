import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {
  createNestApplication,
  getAuthHeaderName,
  getAuthHeaderValue,
  v1Endpoints,
} from './inc/test-utils';
import * as UserExample from './data/user.json';
import * as AdminExample from '@/common/auth/json/admin.json';
import { doingAdminSignIn, doingSignIn } from './inc/common_op';
import { UserService } from '@/common/user/services/user.service';

describe('AuthAdminController (e2e)', () => {
  let app: INestApplication;
  let userService: UserService;
  const createAdmin = async () => {
    return userService.createAdmin({
      email: AdminExample.email,
      name: AdminExample.name,
      password: AdminExample.password,
    });
  };

  beforeEach(async () => {
    app = await createNestApplication();
    userService = app.get<UserService>(UserService);
  });

  describe('/admin/auth/sign-in (POST)', () => {
    const endpoint = '/admin/auth/sign-in';
    const exampleData = {
      email: AdminExample.email,
      password: AdminExample.password,
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

    it('email must be valid', async () => {
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
      await createAdmin();

      await request(app.getHttpServer())
        .post(endpoint)
        .send({
          email: 'example@gmail.com',
          password: 'kj23uksdjf',
        })
        .expect(401);
    });

    it('do sign in', async () => {
      await createAdmin();

      const { body } = await request(app.getHttpServer())
        .post(endpoint)
        .send(exampleData)
        .expect(201);

      expect(body.id).toBeTruthy();
      expect(body.email).toBe(AdminExample.email);
      expect(body.name).toBe(AdminExample.name);
      expect(body.token).toBeTruthy();
      expect(body.refreshToken).toBeTruthy();
    });
  });

  describe('/admin/auth/sign-out (GET)', () => {
    const endpoint = '/admin/auth/sign-out';
    const exampleData = {
      email: AdminExample.email,
      password: AdminExample.password,
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

      await request(app.getHttpServer())
        .get(endpoint)
        .set('Authorization', ``)
        .send(exampleData)
        .expect(401);
    });

    it('doing sign out', async () => {
      // first create admin then doing signin
      await createAdmin();
      const { body } = await doingAdminSignIn(app, exampleData);

      expect(body.token).toBeTruthy();
      await request(app.getHttpServer())
        .get(endpoint)
        .set('Authorization', `Bearer ${body.token}`)
        .send(exampleData)
        .expect(200);
    });
  });

  describe('/admin/auth/refresh-token (POST)', () => {
    const endpoint = '/admin/auth/refresh-token';
    let token, refreshToken;
    const exampleData = {
      email: AdminExample.email,
      password: AdminExample.password,
    };

    beforeEach(async () => {
      await createAdmin();
      const { body } = await doingAdminSignIn(app, exampleData);
      token = body.token;
      refreshToken = body.refreshToken;
    });

    it('endpoint is valid', async () => {
      const { status } = await request(app.getHttpServer()).post(endpoint);

      expect(status).not.toBe(404);
    });

    it('get error in empty body', async () => {
      await request(app.getHttpServer()).post(endpoint).expect(401);
    });

    it('get unauthorized when refresh token is invalid', async () => {
      await request(app.getHttpServer())
        .post(endpoint)
        .set(getAuthHeaderName(), getAuthHeaderValue(token))
        .expect(401);
    });

    it('refresh token', async () => {
      const { body } = await request(app.getHttpServer())
        .post(endpoint)
        .send({ refreshToken })
        .expect(201);

      expect(body.id).toBeTruthy();
      expect(body.token).toBeTruthy();
      expect(body.refreshToken).toBeTruthy();

      // check new tokens
      await request(app.getHttpServer())
        .post(endpoint)
        .send({ refreshToken: body.refreshToken })
        .expect(201);
      await request(app.getHttpServer())
        .get(v1Endpoints.admin.signOut)
        .set(getAuthHeaderName(), getAuthHeaderValue(body.token))
        .expect(200);
    });
  });
});
