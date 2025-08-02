import { HttpException, HttpStatus } from '@nestjs/common';

export class RegionAlreadyExistsException extends HttpException {
  constructor() {
    super('Region already exists', HttpStatus.CONFLICT);
  }
}
