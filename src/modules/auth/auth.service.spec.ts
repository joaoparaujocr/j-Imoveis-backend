import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { userLogin, userReturnMock, userSaveMock } from './../../mocks/user';
import AppError from './../../error/AppError';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            findOneBy: jest.fn(),
          },
        },
        JwtService,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('sign in auth service', () => {
    it('should be possible to login', async () => {
      const token = 'token';
      jest
        .spyOn(userRepository, 'findOne')
        .mockReturnValue(Promise.resolve(userSaveMock as unknown as User));
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(token);

      const result = await authService.signIn(userLogin);

      expect(userRepository.findOne).toBeCalledTimes(1);
      expect(jwtService.signAsync).toBeCalledTimes(1);
      expect(result).toEqual({
        access_token: token,
      });
    });

    it('should not be possible to login with invalid email', async () => {
      jest
        .spyOn(userRepository, 'findOne')
        .mockReturnValue(Promise.resolve(null));
      try {
        await authService.signIn(userLogin);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.message).toBe('Incorrect email or password');
        expect(error.status).toBe(401);
      }
    });

    it('should not be possible to login with invalid password', async () => {
      jest
        .spyOn(userRepository, 'findOne')
        .mockReturnValue(Promise.resolve(userSaveMock as unknown as User));

      try {
        await authService.signIn({
          ...userLogin,
          password: 'SenhaIncorret@a1234$',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.message).toBe('Incorrect email or password');
        expect(error.status).toBe(401);
      }
    });

    it('should be possible to get the profile', async () => {
      jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValue(Promise.resolve(userSaveMock as unknown as User));

      const result = await authService.getProfile(1);

      expect(userRepository.findOneBy).toBeCalledTimes(1);
      expect(result).toEqual(userReturnMock);
    });
  });
});
