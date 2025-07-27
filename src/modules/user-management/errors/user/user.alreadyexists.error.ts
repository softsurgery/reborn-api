import { HttpException, HttpStatus } from '@nestjs/common';

export class UserAlreadyExistsException extends HttpException {
  constructor() {
    super('user_already_exists', HttpStatus.CONFLICT);
  }
}
