import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type RequestUserType = {
  id: number;
  name: string;
};

export const RequestUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
