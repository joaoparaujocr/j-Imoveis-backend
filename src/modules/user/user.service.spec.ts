import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import {
  userCreateMock,
  userReturnMock,
  userSaveMock,
} from './../../mocks/user';
import AppError from './../../error/AppError';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            exist: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('user service', () => {
    it('should create a new user', async () => {
      jest
        .spyOn(userRepository, 'exist')
        .mockReturnValue(Promise.resolve(false));
      jest
        .spyOn(userRepository, 'save')
        .mockReturnValue(Promise.resolve(userSaveMock as unknown as User));

      const result = await userService.create(userCreateMock);

      expect(userRepository.exist).toBeCalledTimes(1);
      expect(userRepository.save).toBeCalledTimes(1);
      expect(result).toEqual(userReturnMock);
    });

    it('should generate a user error already exists', async () => {
      jest
        .spyOn(userRepository, 'exist')
        .mockReturnValue(Promise.resolve(true));

      try {
        await userService.create(userCreateMock);
      } catch (error) {
        expect(userRepository.exist).toBeCalledTimes(1);
        expect(error).toBeInstanceOf(AppError);
        expect(error.message).toBe('Email already exists.');
        expect(error.status).toBe(409);
      }
    });

    it('should not be possible to search all users with a non-admin', async () => {
      try {
        await userService.findAll({ path: '/user' }, false);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.message).toBe(
          'You do not have permission for this feature',
        );
        expect(error.status).toBe(401);
      }
    });
  });
});
