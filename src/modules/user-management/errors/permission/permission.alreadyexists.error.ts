import { HttpException, HttpStatus } from '@nestjs/common';

export class PermissionAlreadyExistsException extends HttpException {
  constructor() {
    super('Permission already exists', HttpStatus.CONFLICT);
  }
}
