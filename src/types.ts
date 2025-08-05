import { Request as ExpressRequest } from 'express';

export interface RequestWithLogInfo extends ExpressRequest {
  user?: {
    sub: string;
    email: string;
  };
  logInfo?: Record<string, unknown>;
}
