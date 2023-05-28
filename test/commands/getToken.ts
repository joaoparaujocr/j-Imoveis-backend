import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { SignInUserDto } from './../../src/modules/auth/dto/signin-user.dto';

export async function getToken(
  { email, password }: SignInUserDto,
  app: INestApplication,
) {
  const { body } = await request(app.getHttpServer()).post('/auth/login').send({
    email,
    password,
  });

  return body.access_token;
}
