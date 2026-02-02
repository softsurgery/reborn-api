import { HttpException, HttpStatus } from '@nestjs/common';

export class UserRequirePasswordException extends HttpException {
  constructor() {
    super('user_require_password', HttpStatus.BAD_REQUEST);
  }
}
