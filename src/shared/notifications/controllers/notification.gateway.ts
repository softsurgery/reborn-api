import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { getTokenPayloadForWebSocket } from 'src/shared/auth/utils/token-payload';
import { AdvancedSocket } from 'src/types';
import { Injectable, Logger } from '@nestjs/common';
import { NotificationService } from '../services/notification.service';
import { NotificationEntity } from '../entities/notification.entity';
import { NotificationType } from '../../../app/enums/notification-type.enum';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/notifications',
})
@Injectable()
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(NotificationGateway.name);

  @WebSocketServer()
  server: Server;

  private readonly userSockets = new Map<string, Set<string>>();

  constructor(private readonly notificationService: NotificationService) {}

  handleConnection(client: AdvancedSocket) {
    const payload = getTokenPayloadForWebSocket(client);
    if (!payload) {
      client.disconnect();
      return;
    }

    const userId = payload.sub;
    client.data.userId = userId;

    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId)!.add(client.id);

    this.logger.log(`✅ User ${userId} connected (${client.id})`);
  }

  handleDisconnect(client: AdvancedSocket) {
    const userId = client.data?.userId;
    if (!userId) return;

    const sockets = this.userSockets.get(userId);
    if (sockets) {
      sockets.delete(client.id);
      if (sockets.size === 0) {
        this.userSockets.delete(userId);
      }
    }

    this.logger.log(`❌ User ${userId} disconnected (${client.id})`);
  }

  async notifyUser(
    userId: string,
    type: NotificationType,
    payload: Record<string, unknown>,
  ): Promise<NotificationEntity> {
    const saved = await this.notificationService.save({
      payload,
      type,
      userId,
    });

    const sockets = this.userSockets.get(userId);
    if (sockets?.size) {
      for (const socketId of sockets) {
        this.server.to(socketId).emit('notification', saved);
      }
      this.logger.log(`📨 Sent live notification to ${userId}`);
    } else {
      this.logger.log(`💾 User ${userId} offline — notification stored only`);
    }

    return saved;
  }

  async notifyUsers(
    userIds: string[],
    type: NotificationType,
    payload: Record<string, unknown>,
  ): Promise<NotificationEntity[]> {
    const results: NotificationEntity[] = [];
    for (const userId of userIds) {
      const notif = await this.notifyUser(userId, type, payload);
      results.push(notif);
    }
    return results;
  }
}
