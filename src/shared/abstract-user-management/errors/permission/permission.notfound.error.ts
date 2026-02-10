import { HttpException, HttpStatus } from '@nestjs/common';

export class PermissionNotFoundException extends HttpException {
  constructor() {
    super('Permission not found', HttpStatus.NOT_FOUND);
  }
}
