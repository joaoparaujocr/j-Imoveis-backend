import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { RequestUserDto } from './../modules/user/dto/request-user.dto';
export interface RequestUserType extends Request {
  user: RequestUserDto;
}

export const RequestUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest() as RequestUserType;

    return request;
  },
);
