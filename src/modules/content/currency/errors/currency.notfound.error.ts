import { HttpException, HttpStatus } from '@nestjs/common';

export class CurrencyNotFoundException extends HttpException {
  constructor() {
    super('Currency not found', HttpStatus.NOT_FOUND);
  }
}
