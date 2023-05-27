import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { userReturn } from './../../schemas/User';
import AppError from './../../error/AppError';
import { PaginateQuery, paginate } from 'nestjs-paginate';

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

    const users = paginate(query, this.usersRepository, {
      sortableColumns: ['createdAt', 'deletedAt', 'updatedAt', 'id', 'name'],
      defaultSortBy: [['id', 'ASC']],
    });

    return users;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
