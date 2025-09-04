import { HttpException, HttpStatus } from '@nestjs/common';

export class JobRequestNotFoundException extends HttpException {
  constructor() {
    super('Job request not found', HttpStatus.NOT_FOUND);
  }
}
