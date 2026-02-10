import { HttpException, HttpStatus } from '@nestjs/common';

export class FollowCannotFollowYourselfException extends HttpException {
  constructor() {
    super('Cannot follow yourself', HttpStatus.CONFLICT);
  }
}
