import { ApiProperty } from '@nestjs/swagger';

export class ResponseResetTokenDto {
  @ApiProperty({ type: String, example: 'user@example.com' })
  email: string;

  @ApiProperty({ type: Boolean, example: true })
  success: boolean;
}
