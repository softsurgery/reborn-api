import { HttpException, HttpStatus } from '@nestjs/common';

export class JobRequestNotEnoughPointsException extends HttpException {
  constructor() {
    super('Not enough points to apply for this job', HttpStatus.BAD_REQUEST);
  }
}
