import { HttpException, HttpStatus } from '@nestjs/common';

export class JobRequestCannotRequestOwnJobException extends HttpException {
  constructor() {
    super('You cannot request your own job', HttpStatus.BAD_REQUEST);
  }
}
