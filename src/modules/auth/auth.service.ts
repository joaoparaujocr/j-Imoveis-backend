import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './../user/entities/user.entity';
import { Repository } from 'typeorm';
import { SignInUserDto } from './dto/signin-user.dto';
import AppError from '../../error/AppError';
import * as bcrypt from 'bcrypt';
import { userReturn } from './../../schemas/User';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signIn({ email, password }: SignInUserDto) {
    const user = await this.usersRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new AppError('Incorrect email or password', 401);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new AppError('Incorrect email or password', 401);
    }

    const { name, id } = user;

    const payload = { name, id };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async getProfile(id: number) {
    const user = await this.usersRepository.findOneBy({
      id,
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return userReturn.parse(user);
  }
}
