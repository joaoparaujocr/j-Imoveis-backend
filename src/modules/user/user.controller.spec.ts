import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { userCreateMock, userReturnMock } from './../../mocks/user';
import AppError from './../../error/AppError';
import { IsAdminInterceptor } from './../../interceptors/isAdmin.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: APP_INTERCEPTOR,
          useExisting: IsAdminInterceptor,
        },
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn(),
          },
        },
        IsAdminInterceptor,
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('create user controller', () => {
    it('should be able to create a user', async () => {
      jest
        .spyOn(userService, 'create')
        .mockReturnValue(Promise.resolve(userReturnMock));

      const result = await userController.create(userCreateMock);

      expect(userService.create).toBeCalledTimes(1);
      expect(result).toEqual(userReturnMock);
    });

    it('should return an error that the user already exists', async () => {
      jest
        .spyOn(userService, 'create')
        .mockRejectedValue(new AppError('Email already exists.', 409));

      try {
        await userController.create(userCreateMock);
      } catch (error) {
        expect(userService.create).toBeCalledTimes(1);
        expect(error).toBeInstanceOf(AppError);
        expect(error.message).toBe('Email already exists.');
        expect(error.status).toBe(409);
      }
    });
  });
});
