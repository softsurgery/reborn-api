import { HttpException, HttpStatus } from '@nestjs/common';

export class TemplateStyleNotFoundException extends HttpException {
  constructor() {
    super('Template style not found', HttpStatus.NOT_FOUND);
  }
}
