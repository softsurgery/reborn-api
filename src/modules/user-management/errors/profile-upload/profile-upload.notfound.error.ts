import { HttpException, HttpStatus } from '@nestjs/common';

export class ProfileUploadNotFoundException extends HttpException {
  constructor() {
    super('Profile upload not found', HttpStatus.NOT_FOUND);
  }
}
