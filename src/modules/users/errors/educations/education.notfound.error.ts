import { HttpException, HttpStatus } from '@nestjs/common';

export class EducationNotFoundException extends HttpException {
  constructor() {
    super('Education not found', HttpStatus.NOT_FOUND);
  }
}
