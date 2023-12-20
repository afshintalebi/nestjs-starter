import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {
  createNestApplication,
  getAuthHeaderName,
  getAuthHeaderValue,
} from './inc/test-utils';
import * as UserExample from './data/user.json';
import { doingSignIn } from './inc/common_op';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createNestApplication();
  });

  describe('/v1/user/profile (GET)', () => {
    const endpoint = '/v1/user/profile';
    const exampleData = {
      email: UserExample.email,
      password: UserExample.password,
    };

    it('endpoint is valid', async () => {
      const { status } = await request(app.getHttpServer()).get(endpoint);

      expect(status).not.toBe(404);
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

    it('get user profile', async () => {
      // first doing signin
      const { body } = await doingSignIn(app, UserExample, exampleData);

      const { body: profile } = await request(app.getHttpServer())
        .get(endpoint)
        .set(getAuthHeaderName(), getAuthHeaderValue(body.token))
        .send(exampleData)
        .expect(200);

      expect(profile.id).toBeTruthy();
      expect(profile.email).toBe(UserExample.email);
      expect(profile.name).toBe(UserExample.name);
    });
  });

  describe('/v1/user/change-password (PATCH)', () => {
    const endpoint = '/v1/user/change-password';
    let token;
    const passwords = {
      origin: '123MK4$2kf',
      weak: '1234',
    };
    const exampleData = {
      email: UserExample.email,
      password: UserExample.password,
    };

    beforeEach(async () => {
      const { body } = await doingSignIn(app, UserExample, exampleData);
      token = body.token;
    });

    it('endpoint is valid', async () => {
      const { status } = await request(app.getHttpServer()).patch(endpoint);

      expect(status).not.toBe(404);
    });

    it('get unauthorized when refresh token is invalid', async () => {
      await request(app.getHttpServer())
        .patch(endpoint)
        .set(getAuthHeaderName(), '434')
        .expect(401);
    });

    it('get error in empty body', async () => {
      await request(app.getHttpServer())
        .patch(endpoint)
        .set(getAuthHeaderName(), getAuthHeaderValue(token))
        .expect(400);
    });

    it('new password is weak', async () => {
      await request(app.getHttpServer())
        .patch(endpoint)
        .set(getAuthHeaderName(), getAuthHeaderValue(token))
        .send({
          currentPassword: UserExample.password,
          newPassword: passwords.weak,
        })
        .expect(400);
    });

    it('current password is wrong', async () => {
      await request(app.getHttpServer())
        .patch(endpoint)
        .set(getAuthHeaderName(), getAuthHeaderValue(token))
        .send({
          currentPassword: passwords.origin,
          newPassword: passwords.weak,
        })
        .expect(400);
    });

    it('change user password', async () => {
      await request(app.getHttpServer())
        .patch(endpoint)
        .set(getAuthHeaderName(), getAuthHeaderValue(token))
        .send({
          currentPassword: UserExample.password,
          newPassword: passwords.origin,
        })
        .expect(200);

      await doingSignIn(app, null, {
        email: UserExample.email,
        password: passwords.origin,
      });
    });
  });
});
