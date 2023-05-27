import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable } from 'rxjs';
import { RequestUserType } from 'src/decorators/requestUser.decorator';
import AppError from 'src/error/AppError';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class IsAdminInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest() as RequestUserType;
    const userPayload = req.user;

    const user = await this.usersRepository.findOneBy({
      id: userPayload.id,
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    req.user.isAdmin = user.isAdmin;

    return next.handle();
  }
}
