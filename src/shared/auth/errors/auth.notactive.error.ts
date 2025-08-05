import { HttpException, HttpStatus } from '@nestjs/common';

export class AuthNotActiveException extends HttpException {
  constructor() {
    super('User not active', HttpStatus.UNAUTHORIZED);
  }
}
