import { HttpException, HttpStatus } from '@nestjs/common';

export class StoreNotFoundException extends HttpException {
  constructor() {
    super('Store not found', HttpStatus.NOT_FOUND);
  }
}
