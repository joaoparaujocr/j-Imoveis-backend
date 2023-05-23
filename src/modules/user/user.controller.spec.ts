import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { userCreateMock, userReturnMock } from './../../mocks/user';
import AppError from './../../error/AppError';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
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
