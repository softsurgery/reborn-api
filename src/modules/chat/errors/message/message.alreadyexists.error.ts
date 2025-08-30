import { HttpException, HttpStatus } from '@nestjs/common';

export class MessageAlreadyExistsException extends HttpException {
  constructor() {
    super('Message already exists', HttpStatus.CONFLICT);
  }
}
