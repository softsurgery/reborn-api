import { HttpException, HttpStatus } from '@nestjs/common';

export class StorageNotFoundException extends HttpException {
  constructor() {
    super('Upload not found', HttpStatus.NOT_FOUND);
  }
}
