import { HttpException, HttpStatus } from '@nestjs/common';

export class FollowNotFoundException extends HttpException {
  constructor() {
    super('Follow not found', HttpStatus.NOT_FOUND);
  }
}
