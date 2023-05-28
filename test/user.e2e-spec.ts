import { INestApplication } from '@nestjs/common';
import { APP_GUARD, HttpAdapterHost } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AllExceptionsFilter } from './../src/filters/handleError.filter';
import { User } from './../src/modules/user/entities/user.entity';
import { UserModule } from './../src/modules/user/user.module';
import * as request from 'supertest';
import {
  userAdminReturnMock,
  userCreateAdmin,
  userCreateMock,
  userReturnMock,
} from './../src/mocks/user';
import { AuthModule } from './../src/modules/auth/auth.module';
import { AuthGuard } from './../src/modules/auth/auth.guard';
import { getToken } from './commands/getToken';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
        UserModule,
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
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/user', () => {
    let tokenUser: string;
    let tokenUserAdmin: string;

    it('should be possible to create a non-admin user', async () => {
      const { body, statusCode } = await request(app.getHttpServer())
        .post('/user')
        .send(userCreateMock);

      expect(statusCode).toBe(201);
      expect(body).toEqual({
        ...userReturnMock,
        createdAt: body.createdAt,
        updatedAt: body.updatedAt,
      });

      tokenUser = await getToken(
        {
          email: userCreateMock.email,
          password: userCreateMock.password,
        },
        app,
      );
    });

    it('should be possible to create an admin user', async () => {
      const { body, statusCode } = await request(app.getHttpServer())
        .post('/user')
        .send(userCreateAdmin);

      expect(statusCode).toBe(201);
      expect(body).toEqual({
        ...userAdminReturnMock,
        createdAt: body.createdAt,
        updatedAt: body.updatedAt,
      });

      tokenUserAdmin = await getToken(
        {
          email: userCreateAdmin.email,
          password: userCreateAdmin.password,
        },
        app,
      );
    });

    it('should be possible to list all users', async () => {
      const { body, statusCode } = await request(app.getHttpServer())
        .get('/user')
        .set('Authorization', `Bearer ${tokenUserAdmin}`);

      expect(statusCode).toBe(200);
      expect(body.data).toHaveLength(2);
      expect(body.meta).toEqual({
        itemsPerPage: 20,
        totalItems: 2,
        currentPage: 1,
        totalPages: 1,
        sortBy: [['id', 'ASC']],
      });
    });
  });
});
