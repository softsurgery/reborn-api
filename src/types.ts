import { Request as ExpressRequest } from 'express';
import { Socket } from 'socket.io';
import { BatchNotificationInfo } from './shared/notifications/decorators/notify.decorator';

export interface AdvancedRequest extends ExpressRequest {
  user?: {
    sub: string;
    email: string;
  };
  logInfo?: Record<string, unknown>;
  notificationInfo?: Record<string, unknown>;
  batchNotificationInfo?: BatchNotificationInfo[];
}

export interface AdvancedSocket extends Socket {
  user?: {
    id: string;
    email?: string;
    username?: string;
  };
  data: {
    userId?: string;
  };
}
export interface SocketPayload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}
