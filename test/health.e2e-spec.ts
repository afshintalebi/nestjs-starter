import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createNestApplication } from './inc/test-utils';

describe('HealthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createNestApplication();
  });

  it('/health/db (GET)', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/health/db')
      .expect(200);

    expect(body.status).toBe('ok');
    expect(body.info).toBeDefined();
    expect(body.error).toBeTruthy();
    expect(body.error).toStrictEqual({});
    expect(body.details).toBeTruthy();
  });

  it('/health/disk (GET)', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/health/disk')
      .expect(200);

    expect(body.status).toBe('ok');
    expect(body.info).toBeDefined();
    expect(body.error).toBeTruthy();
    expect(body.error).toStrictEqual({});
    expect(body.details).toBeTruthy();
  });
});
