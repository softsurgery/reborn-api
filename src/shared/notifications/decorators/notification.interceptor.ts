import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { tap } from 'rxjs';
import { AdvancedRequest } from 'src/types';
import { AccessTokenPayload } from 'src/shared/auth/interfaces/access-token-payload.interface';
import { getTokenPayload } from 'src/shared/auth/utils/token-payload';
import { NotificationType } from '../enums/notification-type.enum';
import { NotificationGateway } from '../controllers/notification.gateway';

@Injectable()
export class NotificationInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      tap(() => {
        const type = this.reflector.get<NotificationType>(
          'type',
          context.getHandler(),
        );
        if (!type) return;

        const request: AdvancedRequest = context.switchToHttp().getRequest();
        const { notificationInfo } = request;

        let userId: string | undefined;
        if (type === NotificationType.NEW_SIGNIN) {
          userId = notificationInfo?.userId as string;
        } else {
          const payload: AccessTokenPayload = getTokenPayload(request);
          userId = payload?.sub;
        }
        if (!userId) return;

        void this.notificationGateway.notifyUser(
          userId,
          type,
          notificationInfo || {},
        );
      }),
    );
  }
}
