import { Request } from 'express';
import { Socket } from 'socket.io';
import { SocketPayload } from 'src/types';

export function getTokenPayload(request: Request) {
  const authorization = request.headers['authorization'];
  if (authorization && authorization.startsWith('Bearer ')) {
    return JSON.parse(atob(authorization.split('.')[1]));
  }
  return null;
}

export function getTokenPayloadForWebSocket(
  socket: Socket,
): SocketPayload | null {
  const authorization = socket?.handshake?.headers.authorization;
  if (authorization && authorization.startsWith('Bearer ')) {
    return JSON.parse(atob(authorization.split('.')[1]));
  }
  return null;
}
