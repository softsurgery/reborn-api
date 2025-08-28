import { HttpException, HttpStatus } from '@nestjs/common';

export class JobCategoryNotFoundException extends HttpException {
  constructor() {
    super('Job category not found', HttpStatus.NOT_FOUND);
  }
}
