import { HttpException, HttpStatus } from '@nestjs/common';

export class UploadBadRequestException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
