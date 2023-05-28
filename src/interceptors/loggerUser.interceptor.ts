import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable } from 'rxjs';
import { RequestUserType } from 'src/decorators/requestUser.decorator';
import AppError from '../error/AppError';
import { User } from '../modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { userReturn } from './../schemas/User';

@Injectable()
export class LoggerUserInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest() as RequestUserType;
    const userPayload = req.user;

    if (userPayload) {
      const user = await this.usersRepository.findOneBy({
        id: userPayload.id,
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      const userValidate = userReturn.parse(user);

      req.user = userValidate;
    }

    return next.handle();
  }
}
