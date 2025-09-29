import { HttpException, HttpStatus } from '@nestjs/common';

export class JobSaveNotFoundException extends HttpException {
  constructor() {
    super('Job save not found', HttpStatus.NOT_FOUND);
  }
}
