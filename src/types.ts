import { Request as ExpressRequest } from 'express';
import { Socket } from 'socket.io';

export interface AdvancedRequest extends ExpressRequest {
  user?: {
    sub: string;
    email: string;
  };
  logInfo?: Record<string, unknown>;
  notificationInfo?: Record<string, unknown>;
}

export interface AdvancedSocket extends Socket {
  user: {
    id: string;
    username: string;
  };
}

export interface SocketPayload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}
