import { HttpException, HttpStatus } from '@nestjs/common';

export class ConfigurationParamaterInvalideValueException extends HttpException {
  constructor() {
    super('Configuration paramater invalide value', HttpStatus.BAD_REQUEST);
  }
}
