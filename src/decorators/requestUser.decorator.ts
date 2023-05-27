import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
export interface RequestUserType extends Request {
  user: { id: number; name: string; isAdmin: boolean };
}

export const RequestUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    request.user;

    return request as RequestUserType;
  },
);
