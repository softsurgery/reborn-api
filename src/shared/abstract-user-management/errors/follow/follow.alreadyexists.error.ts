import { HttpException, HttpStatus } from '@nestjs/common';

export class FollowAlreadyExistsException extends HttpException {
  constructor() {
    super('Follow already exists', HttpStatus.CONFLICT);
  }
}
