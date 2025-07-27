import { HttpException, HttpStatus } from '@nestjs/common';

export class DeviceInfoAlreadyExistsException extends HttpException {
  constructor() {
    super('Device info already exists', HttpStatus.CONFLICT);
  }
}
