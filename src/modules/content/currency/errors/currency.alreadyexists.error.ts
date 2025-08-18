import { HttpException, HttpStatus } from '@nestjs/common';

export class CurrencyAlreadyExistsException extends HttpException {
  constructor() {
    super('Currency already exists', HttpStatus.CONFLICT);
  }
}
