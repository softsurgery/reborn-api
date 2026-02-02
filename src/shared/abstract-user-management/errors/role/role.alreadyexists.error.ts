import { HttpException, HttpStatus } from '@nestjs/common';

export class RoleAlreadyExistsException extends HttpException {
  constructor() {
    super('Role already exists', HttpStatus.CONFLICT);
  }
}
