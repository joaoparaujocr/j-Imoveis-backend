import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from '../src/modules/auth/auth.module';
import { userLogin } from '../src/mocks/user';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './../src/modules/user/entities/user.entity';
import { AuthGuard } from './../src/modules/auth/auth.guard';
import { createUserDB } from './commands/createUser';
import { APP_GUARD, HttpAdapterHost } from '@nestjs/core';
import { AllExceptionsFilter } from './../src/filters/handleError.filter';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userCreated: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User],
          logging: false,
          synchronize: true,
        }),
      ],
      providers: [
        {
          provide: APP_GUARD,
          useExisting: AuthGuard,
        },
        AuthGuard,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    const httpAdapter = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

    await app.init();
    userCreated = await createUserDB(app);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth', () => {
    let token: string;

    it('should not be possible to login with an invalid email', async () => {
      const { body, statusCode } = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'noalreadyexists@email.com',
          password: 'InvalidPassword',
        });

      expect(statusCode).toBe(401);
      expect(body).toEqual({
        timestamp: body.timestamp,
        message: 'Incorrect email or password',
      });
    });

    it('should be possible to create the token of a registered user', async () => {
      const { body, statusCode } = await request(app.getHttpServer())
        .post('/auth/login')
        .send(userLogin);

      expect(statusCode).toBe(HttpStatus.CREATED);
      expect(body).toHaveProperty('access_token');

      token = body.access_token;
    });

    it('should be possible to get the information of the logged in user', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(body).toEqual(userCreated);
    });

    it('should not be possible to get the profile without a token', async () => {
      const { body, statusCode } = await request(app.getHttpServer()).get(
        '/auth/profile',
      );

      expect(statusCode).toBe(401);
      expect(body).toEqual({
        statusCode: 401,
        timestamp: body.timestamp,
        path: '/auth/profile',
      });
    });
  });
});
