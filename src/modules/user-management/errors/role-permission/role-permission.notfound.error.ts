import { HttpException, HttpStatus } from '@nestjs/common';

export class RolePermissionNotFoundException extends HttpException {
  constructor() {
    super('Role permission not found', HttpStatus.NOT_FOUND);
  }
}
