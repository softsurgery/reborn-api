import { HttpException, HttpStatus } from '@nestjs/common';

export class LogNotFoundException extends HttpException {
  constructor() {
    super('Log not found', HttpStatus.NOT_FOUND);
  }
}
