import { HttpException, HttpStatus } from '@nestjs/common';

export class TemplateNotFoundException extends HttpException {
  constructor() {
    super('Template not found', HttpStatus.NOT_FOUND);
  }
}
