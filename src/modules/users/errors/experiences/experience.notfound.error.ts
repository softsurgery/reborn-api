import { HttpException, HttpStatus } from '@nestjs/common';

export class ExperienceNotFoundException extends HttpException {
  constructor() {
    super('Experience not found', HttpStatus.NOT_FOUND);
  }
}
