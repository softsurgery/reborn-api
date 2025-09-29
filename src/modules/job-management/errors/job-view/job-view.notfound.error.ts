import { HttpException, HttpStatus } from '@nestjs/common';

export class JobViewNotFoundException extends HttpException {
  constructor() {
    super('Job view not found', HttpStatus.NOT_FOUND);
  }
}
