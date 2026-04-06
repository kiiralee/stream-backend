/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';

export const UserAgent = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  if (ctx.getType() === 'http') {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const request = ctx.switchToHttp().getRequest() as Request;

    return request.headers['user-agent'];
  } else {
    const context = GqlExecutionContext.create(ctx);

    return context.getContext().req.headers['user-agent'];
  }
});
