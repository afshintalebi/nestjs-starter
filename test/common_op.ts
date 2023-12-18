import * as request from 'supertest';

const v1Endpoints = {
    signUp: '/v1/auth/sign-up',
    signIn: '/v1/auth/sign-in',
}

export async function doSignUp(app, data): Promise<request.Test> {
    return request(app.getHttpServer()).post(v1Endpoints.signUp).send(data).expect(201);
}

export async function doSignIn(app, data): Promise<request.Test> {
    return request(app.getHttpServer()).post(v1Endpoints.signIn).send(data).expect(201);
}