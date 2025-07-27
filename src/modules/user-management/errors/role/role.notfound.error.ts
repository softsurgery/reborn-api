import { HttpException, HttpStatus } from '@nestjs/common';

export class RoleNotFoundException extends HttpException {
  constructor() {
    super('Role not found', HttpStatus.NOT_FOUND);
  }
}
