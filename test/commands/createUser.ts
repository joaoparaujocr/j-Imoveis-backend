import { HttpStatus, INestApplication } from '@nestjs/common';
import { userCreateMock, userReturnMock } from './../../src/mocks/user';
import * as request from 'supertest';

export default async function createUserDB(app: INestApplication) {
  const { body, statusCode } = await request(app.getHttpServer())
    .post('/user')
    .send(userCreateMock);

  expect(statusCode).toBe(HttpStatus.CREATED);
  expect(body).toEqual({
    ...userReturnMock,
    createdAt: body.createdAt,
    updatedAt: body.updatedAt,
  });

  return body;
}
