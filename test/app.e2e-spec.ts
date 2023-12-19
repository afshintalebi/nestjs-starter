import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createNestApplication } from './inc/test-utils';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createNestApplication();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/v1')
      .expect(200)
      .expect('API version 1');
  });
});
