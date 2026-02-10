import { HttpException, HttpStatus } from '@nestjs/common';

export class UserUploadNotFoundException extends HttpException {
  constructor() {
    super('User upload not found', HttpStatus.NOT_FOUND);
  }
}
