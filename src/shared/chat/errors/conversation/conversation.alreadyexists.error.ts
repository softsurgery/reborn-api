import { HttpException, HttpStatus } from '@nestjs/common';

export class ConversationAlreadyExistsException extends HttpException {
  constructor() {
    super('Conversation already exists', HttpStatus.CONFLICT);
  }
}
