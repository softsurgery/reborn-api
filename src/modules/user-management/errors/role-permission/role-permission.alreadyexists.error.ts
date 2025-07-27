import { HttpException, HttpStatus } from '@nestjs/common';

export class RolePermissionAlreadyExistsException extends HttpException {
  constructor() {
    super('Role permission already exists', HttpStatus.CONFLICT);
  }
}
