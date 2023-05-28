import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { userLogin, userReturnMock } from './../../mocks/user';
import AppError from './../../error/AppError';
import { RequestUserType } from 'src/decorators/requestUser.decorator';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signIn: jest.fn(),
            getProfile: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
    expect(authService).toBeDefined();
  });

  describe('auth controller', () => {
    it('should be possible to login', async () => {
      const accessToken = {
        access_token: 'token',
      };
      jest
        .spyOn(authService, 'signIn')
        .mockReturnValue(Promise.resolve(accessToken));

      const result = await authController.signIn(userLogin);

      expect(authService.signIn).toBeCalledTimes(1);
      expect(result).toEqual(accessToken);
    });

    it('should throw an error', async () => {
      jest
        .spyOn(authService, 'signIn')
        .mockRejectedValueOnce(
          new AppError('Incorrect email or password', 401),
        );

      try {
        await authController.signIn(userLogin);
      } catch (error) {
        expect(authService.signIn).toBeCalledTimes(1);
        expect(error).toBeInstanceOf(AppError);
        expect(error.message).toBe('Incorrect email or password');
        expect(error.status).toBe(401);
      }
    });

    it('should return user information', async () => {
      jest
        .spyOn(authService, 'getProfile')
        .mockReturnValue(Promise.resolve(userReturnMock));

      const result = await authController.getProfile({
        user: {
          id: userReturnMock.id,
          name: userReturnMock.name,
        },
      } as RequestUserType);

      expect(authService.getProfile).toBeCalledTimes(1);
      expect(result).toEqual(userReturnMock);
    });

    it('should return that the user was not found', async () => {
      jest
        .spyOn(authService, 'getProfile')
        .mockRejectedValueOnce(new AppError('User not found', 404));

      try {
        await authController.getProfile({
          user: {
            id: userReturnMock.id,
            name: userReturnMock.name,
          },
        } as RequestUserType);
      } catch (error) {
        expect(authService.getProfile).toBeCalledTimes(1);
        expect(error).toBeInstanceOf(AppError);
        expect(error.message).toBe('User not found');
        expect(error.status).toBe(404);
      }
    });

    it('should prevent a user without a token from accessing the route', async () => {
      jest.spyOn(authService, 'getProfile').mockRejectedValueOnce({
        statusCode: 401,
        timestamp: '2023-05-28T01:17:05.124Z',
        path: '/auth/profile',
      });

      try {
        await authController.getProfile({
          user: {
            id: userReturnMock.id,
            name: userReturnMock.name,
          },
        } as RequestUserType);
      } catch (error) {
        expect(error).toEqual({
          statusCode: 401,
          timestamp: '2023-05-28T01:17:05.124Z',
          path: '/auth/profile',
        });
      }
    });
  });
});
