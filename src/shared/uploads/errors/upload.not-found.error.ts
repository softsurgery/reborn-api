import { HttpException, HttpStatus } from '@nestjs/common';

export class UploadNotFoundException extends HttpException {
  constructor() {
    super('Upload not found', HttpStatus.NOT_FOUND);
  }
}
