import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { userReturn } from './../../schemas/User';
import AppError from './../../error/AppError';
import { PaginateQuery, paginate } from 'nestjs-paginate';
import { RequestUserDto } from './dto/request-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const emailAlreadyExists = await this.usersRepository.exist({
      where: {
        email: createUserDto.email,
      },
    });

    if (emailAlreadyExists) {
      throw new AppError('Email already exists.', 409);
    }

    const user = await this.usersRepository.save(createUserDto);

    return userReturn.parse(user);
  }

  async findAll(query: PaginateQuery, isAdmin: boolean) {
    if (!isAdmin) {
      throw new AppError('You do not have permission for this feature', 401);
    }

    const select = [
      'entity.id',
      'entity.name',
      'entity.email',
      'entity.createdAt',
      'entity.updatedAt',
      'entity.deletedAt',
      'entity.isAdmin',
      'entity.isActive',
    ];

    const queryBuilder = this.usersRepository.createQueryBuilder('entity');

    queryBuilder.select(select);

    const users = await paginate(query, queryBuilder, {
      sortableColumns: ['createdAt', 'deletedAt', 'updatedAt', 'id', 'name'],
      defaultSortBy: [['id', 'ASC']],
      select: ['email', 'name'],
    });

    return users;
  }

  async findOne(id: number, userLogger: RequestUserDto) {
    if (!userLogger.isAdmin && userLogger.id !== id) {
      throw new AppError('You do not have permission for this feature', 401);
    }

    const user = await this.usersRepository.findOneBy({
      id,
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return userReturn.parse(user);
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    userLogger: RequestUserDto,
  ) {
    if (!userLogger.isAdmin && userLogger.id !== id) {
      throw new AppError('You do not have permission for this feature', 401);
    }

    const user = await this.usersRepository.exist({
      where: { id },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    await this.usersRepository.update(
      {
        id,
      },
      updateUserDto,
    );

    const userUpdate = await this.usersRepository.findOneBy({
      id,
    });

    return userReturn.parse(userUpdate);
  }

  async remove(id: number, userLogger: RequestUserDto) {
    if (!userLogger.isAdmin && userLogger.id !== id) {
      throw new AppError('You do not have permission for this feature', 401);
    }

    await this.usersRepository
      .createQueryBuilder()
      .update()
      .set({
        isActive: false,
      })
      .where('id = :id', { id })
      .execute();

    await this.usersRepository
      .createQueryBuilder()
      .softDelete()
      .where('id = :id', { id })
      .execute();

    return `User delete`;
  }
}
