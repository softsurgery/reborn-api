import { Request as ExpressRequest } from 'express';

export interface RequestWithLogInfo extends ExpressRequest {
  user?: {
    id: string;
    email: string;
  };
  logInfo?: Record<string, unknown>;
}
