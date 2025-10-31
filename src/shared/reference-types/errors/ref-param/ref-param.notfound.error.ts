import { HttpException, HttpStatus } from '@nestjs/common';

export class RefParamNotFoundException extends HttpException {
  constructor() {
    super('RefParam not found', HttpStatus.NOT_FOUND);
  }
}
