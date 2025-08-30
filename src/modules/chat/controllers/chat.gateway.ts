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
import { ChatSocket } from 'src/types';
import { MessageService } from '../services/message.service';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly messageService: MessageService,
  ) {}

  handleConnection(client: ChatSocket) {
    const payload = getTokenPayloadForWebSocket(client);
    console.log('payload', payload);
    if (!payload) {
      client.disconnect();
      return;
    }

    // Safe logging
    console.log('Socket connected:', {
      id: client.id,
      user: client.user,
      handshake: client.handshake.headers,
    });
  }

  handleDisconnect(client: ChatSocket) {
    const payload = getTokenPayloadForWebSocket(client);
    console.log(`User ${payload?.sub || 'Unknown'} disconnected`);
  }

  @SubscribeMessage('joinConversation')
  async joinConversation(
    @ConnectedSocket() client: ChatSocket,
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
    console.log(`User ${userId} joined conversation ${data.conversationId}`);

    client.emit(
      'conversationHistory',
      await this.messageService.findAll({
        filter: `conversationId||$eq||${data.conversationId}`,
      }),
    );
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: ChatSocket,
    @MessageBody() data: { conversationId: number; content: string },
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

    const message = await this.chatService.createMessage(
      data.conversationId,
      data.content,
      userId,
    );

    this.server
      .to(`conversation_${data.conversationId}`)
      .emit('message', message);
  }
}
