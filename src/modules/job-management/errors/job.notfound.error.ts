import { HttpException, HttpStatus } from '@nestjs/common';

export class JobNotFoundException extends HttpException {
  constructor() {
    super('Job not found', HttpStatus.NOT_FOUND);
  }
}
