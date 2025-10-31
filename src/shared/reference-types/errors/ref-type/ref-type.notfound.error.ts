import { HttpException, HttpStatus } from '@nestjs/common';

export class RefTypeNotFoundException extends HttpException {
  constructor() {
    super('RefType not found', HttpStatus.NOT_FOUND);
  }
}
