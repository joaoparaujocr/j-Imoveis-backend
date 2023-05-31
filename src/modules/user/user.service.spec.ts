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
import { userAdminReturnMock } from './../../mocks/user';

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
            findOneBy: jest.fn(),
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

    it('should return that the user does not exist', async () => {
      const { id, name, email, isActive } = userReturnMock;

      jest
        .spyOn(userRepository, 'findOneBy')
        .mockReturnValue(Promise.resolve(null));

      try {
        await userService.findOne(45, {
          id,
          name,
          email,
          isActive,
          isAdmin: true,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.message).toBe('User not found');
        expect(error.status).toBe(404);
      }
    });

    it('should return an error if the user is not an admin and also not the owner of the resource', async () => {
      const { id, name, email, isActive, isAdmin } = userReturnMock;

      jest
        .spyOn(userRepository, 'findOneBy')
        .mockReturnValue(Promise.resolve(null));

      try {
        await userService.findOne(45, {
          id,
          name,
          email,
          isActive,
          isAdmin,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.message).toBe(
          'You do not have permission for this feature',
        );
        expect(error.status).toBe(401);
      }
    });

    it('it should be possible to update the user information being admin', async () => {
      const { id, name, email, isActive, isAdmin } = userAdminReturnMock;

      jest
        .spyOn(userRepository, 'findOneBy')
        .mockReturnValue(Promise.resolve(userReturnMock as unknown as User));

      const res = await userService.findOne(1, {
        id,
        name,
        email,
        isActive,
        isAdmin,
      });

      expect(res).toEqual(userReturnMock);
    });

    it('it must be possible to update the information of the user being the owner', async () => {
      const { id, name, email, isActive, isAdmin } = userReturnMock;

      jest
        .spyOn(userRepository, 'findOneBy')
        .mockReturnValue(Promise.resolve(userReturnMock as unknown as User));

      const res = await userService.findOne(1, {
        id,
        name,
        email,
        isActive,
        isAdmin,
      });

      expect(res).toEqual(userReturnMock);
    });
  });
});
