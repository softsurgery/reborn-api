import { HttpException, HttpStatus } from '@nestjs/common';

export class JobUploadNotFoundException extends HttpException {
  constructor() {
    super('Job upload not found', HttpStatus.NOT_FOUND);
  }
}
