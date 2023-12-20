import * as request from 'supertest';
import { v1Endpoints } from './test-utils';

export async function doingSignUp(app, data): Promise<request.Test> {
  return request(app.getHttpServer())
    .post(v1Endpoints.signUp)
    .send(data)
    .expect(201);
}

export async function doingSignIn(
  app,
  signUpData = null,
  data,
): Promise<request.Test> {
  if (signUpData) await doingSignUp(app, signUpData);

  return request(app.getHttpServer())
    .post(v1Endpoints.signIn)
    .send(data)
    .expect(201);
}

export async function doingResetPassword(
  app,
  signUpData,
): Promise<request.Test> {
  await doingSignUp(app, signUpData);

  return request(app.getHttpServer())
    .patch(v1Endpoints.resetPassword)
    .send({
      email: signUpData.email,
    })
    .expect(200);
}

export async function doingAdminSignIn(app, data): Promise<request.Test> {
  return request(app.getHttpServer())
    .post(v1Endpoints.admin.signIn)
    .send(data)
    .expect(201);
}
