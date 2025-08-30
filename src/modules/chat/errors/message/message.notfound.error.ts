import { HttpException, HttpStatus } from '@nestjs/common';

export class MessageNotFoundException extends HttpException {
  constructor() {
    super('Message not found', HttpStatus.NOT_FOUND);
  }
}
