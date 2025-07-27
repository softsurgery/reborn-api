import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getTokenPayload } from '../utils/token-payload';

export const InjectAccessTokenPayload = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | null => {
    const request = ctx.switchToHttp().getRequest();
    return getTokenPayload(request);
  },
);
