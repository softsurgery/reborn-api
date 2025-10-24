import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { tap } from 'rxjs';
import { AdvancedRequest } from 'src/types';
import { AccessTokenPayload } from 'src/shared/auth/interfaces/access-token-payload.interface';
import { getTokenPayload } from 'src/shared/auth/utils/token-payload';
import { NotificationService } from '../services/notification.service';
import { NotificationType } from '../enums/notification-type.enum';

@Injectable()
export class NotificationInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly notificationService: NotificationService,
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

        if (type === NotificationType.NEW_SIGNIN) {
          void this.notificationService.save({
            type,
            payload: notificationInfo,
            userId: notificationInfo?.userId as string,
          });

          return;
        }

        const payload: AccessTokenPayload = getTokenPayload(request);

        void this.notificationService.save({
          type,
          payload: notificationInfo,
          userId: payload?.sub,
        });
      }),
    );
  }
}
