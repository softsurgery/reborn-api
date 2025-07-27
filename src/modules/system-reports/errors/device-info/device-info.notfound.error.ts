import { HttpException, HttpStatus } from '@nestjs/common';

export class DeviceInfoNotFoundException extends HttpException {
  constructor() {
    super('Device info not found', HttpStatus.NOT_FOUND);
  }
}
