import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { userReturn } from 'src/schemas/User';
import AppError from 'src/error/AppError';

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

  findAll() {
    return `This action returns all user`;
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
