import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { getTokenPayloadForWebSocket } from 'src/shared/auth/utils/token-payload';
import { AdvancedSocket } from 'src/types';
import { MessageService } from '../services/message.service';
import { CreateMessageDto } from '../dtos/message/create-message.dto';
import { ConversationService } from '../services/conversation.service';
import { UserRepository } from 'src/modules/users/repositories/user.repository';
import { ConversationEntity } from '../entities/conversation.entity';
import { DeepPartial } from 'typeorm';

const MAX_LIMIT = 20;

@WebSocketGateway({
  namespace: '/chat',
  cors: { origin: '*' },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  /**
   * userId -> Set of connected socket IDs (supports multiple devices)
   */
  private readonly connectedUsers = new Map<string, Set<string>>();

  constructor(
    private readonly messageService: MessageService,
    private readonly conversationService: ConversationService,
    private readonly userRepository: UserRepository,
  ) {}

  async handleConnection(client: AdvancedSocket) {
    const payload = getTokenPayloadForWebSocket(client);
    if (!payload) {
      client.disconnect();
      return;
    }

    const userId = payload.sub;
    await client.join(`user_${userId}`);

    // Track connection
    const wasOffline =
      !this.connectedUsers.has(userId) ||
      this.connectedUsers.get(userId)!.size === 0;

    if (!this.connectedUsers.has(userId)) {
      this.connectedUsers.set(userId, new Set());
    }
    this.connectedUsers.get(userId)!.add(client.id);

    // Notify other users if this user just came online
    if (wasOffline) {
      this.broadcastPresenceChange(userId, true);
    }
  }

  async handleDisconnect(client: AdvancedSocket) {
    const payload = getTokenPayloadForWebSocket(client);
    if (!payload) return;

    const userId = payload.sub;
    const sockets = this.connectedUsers.get(userId);

    if (sockets) {
      sockets.delete(client.id);

      // User is fully offline when all sockets are disconnected
      if (sockets.size === 0) {
        this.connectedUsers.delete(userId);
        const now = new Date();
        await this.userRepository.update(userId, { lastSeen: now });
        this.broadcastPresenceChange(userId, false, now);
      }
    }
  }

  // get user online status **************************************************************************************************************************

  @SubscribeMessage('get-user-status')
  async handleGetUserStatus(
    @ConnectedSocket() client: AdvancedSocket,
    @MessageBody() data: { userId: string },
  ) {
    const isOnline = this.isUserOnline(data.userId);
    let lastSeen: Date | null = null;

    if (!isOnline) {
      const user = await this.userRepository.findOneById(data.userId);
      lastSeen = user?.lastSeen ?? null;
    }

    client.emit('user-status', {
      userId: data.userId,
      isOnline,
      lastSeen,
    });
  }

  // get multiple users online status ****************************************************************************************************************

  @SubscribeMessage('get-users-status')
  async handleGetUsersStatus(
    @ConnectedSocket() client: AdvancedSocket,
    @MessageBody() data: { userIds: string[] },
  ) {
    const statuses = await Promise.all(
      data.userIds.map(async (userId) => {
        const isOnline = this.isUserOnline(userId);
        let lastSeen: Date | null = null;

        if (!isOnline) {
          const user = await this.userRepository.findOneById(userId);
          lastSeen = user?.lastSeen ?? null;
        }

        return { userId, isOnline, lastSeen };
      }),
    );

    client.emit('users-status', statuses);
  }

  // helpers *****************************************************************************************************************************************

  isUserOnline(userId: string): boolean {
    const sockets = this.connectedUsers.get(userId);
    return !!sockets && sockets.size > 0;
  }

  private broadcastPresenceChange(
    userId: string,
    isOnline: boolean,
    lastSeen?: Date | null,
  ) {
    this.server.emit('user-presence', {
      userId,
      isOnline,
      lastSeen: lastSeen ?? null,
    });
  }

  async emitUnreadCountUpdate(userId?: string): Promise<void> {
    if (!userId) {
      return;
    }

    const count =
      await this.conversationService.getUnreadConversationCount(userId);

    this.server
      .to(`user_${userId}`)
      .emit('conversations-unread-count', { count });
  }

  async emitNewConversation(
    conversationId: number,
    creatorUserId?: string,
  ): Promise<void> {
    const conversation = await this.conversationService.findOneById(
      conversationId,
      'participants,participants.user,lastMessage,lastMessage.uploads',
    );

    if (!conversation) {
      return;
    }

    for (const participant of conversation.participants ?? []) {
      this.server
        .to(`user_${participant.userId}`)
        .emit('conversation-created', {
          conversation,
          creatorUserId,
        });
    }

    for (const participant of conversation.participants ?? []) {
      if (participant.userId !== creatorUserId) {
        await this.emitUnreadCountUpdate(participant.userId);
      }
    }
  }

  // join a conversation ******************************************************************************************************************************

  @SubscribeMessage('join-conversation')
  async joinConversation(
    @ConnectedSocket() client: AdvancedSocket,
    @MessageBody() data: { conversationId: number },
  ) {
    const payload = getTokenPayloadForWebSocket(client);
    const userId = payload?.sub;

    const isParticipant = await this.conversationService.isUserInConversation(
      data.conversationId,
      userId,
    );

    if (!isParticipant) {
      client.emit('error', 'You are not part of this conversation');
      return;
    }

    const rooms = [...client.rooms];

    for (const room of rooms) {
      if (room.startsWith('conversation_')) {
        await client.leave(room);
      }
    }

    await client.join(`conversation_${data.conversationId}`);

    const recentMessages =
      await this.messageService.findPaginatedConversationMessages(
        {
          sort: 'createdAt,DESC',
          limit: MAX_LIMIT.toString(),
          page: '1',
        },
        data.conversationId,
      );

    client.emit('conversation-messages', recentMessages.data);
  }

  // load messages for a conversation *****************************************************************************************************************

  @SubscribeMessage('get-conversation-messages')
  async getConversationMessages(
    @ConnectedSocket() client: AdvancedSocket,
    @MessageBody()
    data: { conversationId: number; page?: string; limit?: number },
  ) {
    const payload = getTokenPayloadForWebSocket(client);
    const userId = payload?.sub;

    const isParticipant = await this.conversationService.isUserInConversation(
      data.conversationId,
      userId,
    );

    if (!isParticipant) {
      client.emit('error', 'You are not part of this conversation');
      return;
    }

    const messages =
      await this.messageService.findPaginatedConversationMessages(
        {
          sort: 'createdAt,DESC',
          limit: MAX_LIMIT.toString(),
          page: data.page ?? '1',
        },
        data.conversationId,
      );

    client.emit('conversation-messages', messages.data);
  }

  // new message handler *****************************************************************************************************************************
  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: AdvancedSocket,
    @MessageBody() data: CreateMessageDto,
  ): Promise<void> {
    const payload = getTokenPayloadForWebSocket(client);
    const userId = payload?.sub;

    const isParticipant = await this.conversationService.isUserInConversation(
      data.conversationId,
      userId,
    );
    if (!isParticipant) {
      client.emit('error', 'You are not part of this conversation');
      return;
    }

    const message = await this.messageService.createMessage(data, userId);

    await this.conversationService.markConversationAsSeen(
      data.conversationId,
      userId,
      message.createdAt,
    );

    this.server
      .to(`conversation_${data.conversationId}`)
      .emit('message', message);

    let conversation: DeepPartial<ConversationEntity> =
      (await this.conversationService.findOneById(
        data.conversationId,
        'participants,participants.user,lastMessage,lastMessage.uploads',
      )) as DeepPartial<ConversationEntity>;

    conversation = {
      ...conversation,
      messages: [message],
    };

    for (const participant of conversation?.participants ?? []) {
      this.server
        .to(`user_${participant.userId}`)
        .emit('conversation-updated-last-check', conversation);
    }

    for (const participant of conversation?.participants ?? []) {
      this.server
        .to(`user_${participant.userId}`)
        .emit('conversation-updated-message', conversation);
    }
  }

  // mark conversation as seen ***********************************************************************************************************************
  @SubscribeMessage('see-conversation')
  async seeConversation(
    @ConnectedSocket() client: AdvancedSocket,
    @MessageBody() data: { conversationId: number; lastCheck?: string },
  ) {
    const payload = getTokenPayloadForWebSocket(client);
    const userId = payload?.sub;

    const isParticipant = await this.conversationService.isUserInConversation(
      data.conversationId,
      userId,
    );

    if (!isParticipant) {
      client.emit('error', 'You are not part of this conversation');
      return;
    }

    const conversation = await this.conversationService.markConversationAsSeen(
      data.conversationId,
      userId,
      data.lastCheck ? new Date(data.lastCheck) : new Date(),
    );

    for (const participant of conversation?.participants ?? []) {
      this.server
        .to(`user_${participant.userId}`)
        .emit('conversation-updated-last-check', conversation);
    }
  }
}
