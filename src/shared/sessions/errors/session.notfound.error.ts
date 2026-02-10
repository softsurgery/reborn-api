import { HttpException, HttpStatus } from '@nestjs/common';

export class SessionNotFoundException extends HttpException {
  constructor() {
    super('Session not found', HttpStatus.NOT_FOUND);
  }
}
