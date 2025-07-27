import { HttpException, HttpStatus } from '@nestjs/common';

export class FeedbackNotFoundException extends HttpException {
  constructor() {
    super('Feedback not found', HttpStatus.NOT_FOUND);
  }
}
