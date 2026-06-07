import { HttpException, HttpStatus } from '@nestjs/common';

export class ConfigurationParamaterNotFoundException extends HttpException {
  constructor() {
    super('Configuration paramater not found', HttpStatus.NOT_FOUND);
  }
}
