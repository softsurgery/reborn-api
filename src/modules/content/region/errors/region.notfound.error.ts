import { HttpException, HttpStatus } from '@nestjs/common';

export class RegionNotFoundException extends HttpException {
  constructor() {
    super('Region not found', HttpStatus.NOT_FOUND);
  }
}
