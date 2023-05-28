import { HttpStatus, INestApplication } from '@nestjs/common';
import {
  userCreateMock,
  userReturnMock,
  userCreateAdmin,
} from './../../src/mocks/user';
import * as request from 'supertest';

export async function createUserDB(app: INestApplication) {
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

export async function createUserAdmin(app: INestApplication) {
  const { body, statusCode } = await request(app.getHttpServer())
    .post('/user')
    .send(userCreateAdmin);

  return body;
}
