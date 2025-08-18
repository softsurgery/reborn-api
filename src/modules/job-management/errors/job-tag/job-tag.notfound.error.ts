import { HttpException, HttpStatus } from '@nestjs/common';

export class JobTagNotFoundException extends HttpException {
  constructor() {
    super('Job tag not found', HttpStatus.NOT_FOUND);
  }
}
