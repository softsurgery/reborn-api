import { HttpException, HttpStatus } from '@nestjs/common';

export class BugNotFoundException extends HttpException {
  constructor() {
    super('Bug not found', HttpStatus.NOT_FOUND);
  }
}
