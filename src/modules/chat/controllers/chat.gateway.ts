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
import { ChatService } from '../services/chat.service';
import { getTokenPayloadForWebSocket } from 'src/shared/auth/utils/token-payload';
import { AdvancedSocket } from 'src/types';
import { MessageService } from '../services/message.service';
import { MessageRepository } from '../repositories/message.repository';
import { LessThan } from 'typeorm';
import { CreateMessageDto } from '../dtos/message/create-message.dto';

const MAX_LIMIT = 20;

@WebSocketGateway({
  cors: { origin: '*' },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly messageService: MessageService,
    private readonly messageRepository: MessageRepository,
  ) {}

  handleConnection(client: AdvancedSocket) {
    const payload = getTokenPayloadForWebSocket(client);
    if (!payload) {
      client.disconnect();
      return;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleDisconnect(_client: AdvancedSocket) {}

  /**
   * When user joins a conversation, load the latest 10 messages
   */
  @SubscribeMessage('joinConversation')
  async joinConversation(
    @ConnectedSocket() client: AdvancedSocket,
    @MessageBody() data: { conversationId: number },
  ) {
    const payload = getTokenPayloadForWebSocket(client);
    const userId = payload?.sub;

    const isParticipant = await this.chatService.isUserInConversation(
      data.conversationId,
      userId,
    );

    if (!isParticipant) {
      client.emit('error', 'You are not part of this conversation');
      return;
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

    // send messages to the client (latest 10)
    client.emit('conversationMessages', recentMessages.data);
  }

  /**
   * When user requests older messages (scrolls up)
   */
  @SubscribeMessage('getConversationMessages')
  async getConversationMessages(
    @ConnectedSocket() client: AdvancedSocket,
    @MessageBody()
    data: { conversationId: number; limit?: number; before?: string },
  ) {
    const payload = getTokenPayloadForWebSocket(client);
    const userId = payload?.sub;

    const isParticipant = await this.chatService.isUserInConversation(
      data.conversationId,
      userId,
    );

    if (!isParticipant) {
      client.emit('error', 'You are not part of this conversation');
      return;
    }

    const messages = await this.messageRepository.findAll({
      where: {
        conversationId: data.conversationId,
        ...(data.before ? { createdAt: LessThan(data.before) } : {}),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
      take: Number(data.limit ?? MAX_LIMIT.toString()),
      order: {
        createdAt: 'DESC',
      },
    });

    client.emit('conversationMessages', messages);
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: AdvancedSocket,
    @MessageBody() data: CreateMessageDto,
  ) {
    const payload = getTokenPayloadForWebSocket(client);
    const userId = payload?.sub;

    const isParticipant = await this.chatService.isUserInConversation(
      data.conversationId,
      userId,
    );
    if (!isParticipant) {
      client.emit('error', 'You are not part of this conversation');
      return;
    }

    const message = await this.chatService.createMessage(data, userId);

    this.server
      .to(`conversation_${data.conversationId}`)
      .emit('message', message);
  }
}
