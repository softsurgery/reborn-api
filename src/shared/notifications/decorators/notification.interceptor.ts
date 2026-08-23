import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { tap } from 'rxjs';
import { AdvancedRequest } from 'src/types';
import { AccessTokenPayload } from 'src/shared/auth/interfaces/access-token-payload.interface';
import { getTokenPayload } from 'src/shared/auth/utils/token-payload';
import { NotificationGateway } from '../gateways/notification.gateway';
import { NotificationType } from '../../../app/enums/notification-type.enum';
import {
  NOTIFY_METADATA_KEY,
  BATCH_NOTIFY_METADATA_KEY,
} from './notify.decorator';
import type { BatchNotificationInfo } from './notify.decorator';

@Injectable()
export class NotificationInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      tap(() => {
        const request: AdvancedRequest = context.switchToHttp().getRequest();
        const payload: AccessTokenPayload = getTokenPayload(request);

        // Handle stacked @Notify decorators
        this.handleNotifyDecorators(context, request, payload);

        // Handle @BatchNotify decorators
        this.handleBatchNotifyDecorators(context, request);
      }),
    );
  }

  private handleNotifyDecorators(
    context: ExecutionContext,
    request: AdvancedRequest,
    payload: AccessTokenPayload,
  ): void {
    const types = Reflect.getMetadata(
      NOTIFY_METADATA_KEY,
      context.getHandler(),
    ) as NotificationType[] | undefined;

    if (!types || types.length === 0) return;

    const { notificationInfo } = request;

    for (const type of types) {
      let notifyUserId = payload?.sub;
      if (type === NotificationType.NEW_SIGNIN) {
        notifyUserId = notificationInfo?.userId as string;
      } else if (notificationInfo?.targetUserId) {
        notifyUserId = notificationInfo.targetUserId as string;
      }

      void this.notificationGateway.notifyUser(
        notifyUserId,
        type,
        notificationInfo ?? {},
      );
    }
  }

  private handleBatchNotifyDecorators(
    context: ExecutionContext,
    request: AdvancedRequest,
  ): void {
    const batchTypes = Reflect.getMetadata(
      BATCH_NOTIFY_METADATA_KEY,
      context.getHandler(),
    ) as NotificationType[] | undefined;

    if (!batchTypes || batchTypes.length === 0) return;

    const batchNotificationInfo =
      request.batchNotificationInfo as BatchNotificationInfo[];
    if (!batchNotificationInfo) return;

    for (const batchInfo of batchNotificationInfo) {
      if (!batchTypes.includes(batchInfo.type)) continue;
      for (const entry of batchInfo.entries) {
        void this.notificationGateway.notifyUser(
          entry.userId,
          batchInfo.type,
          entry.payload,
        );
      }
    }
  }
}
