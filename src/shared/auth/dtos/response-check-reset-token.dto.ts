import { ApiProperty } from '@nestjs/swagger';

export class ResponseCheckResetTokenDto {
  @ApiProperty({
    type: String,
    example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  token: string;

  @ApiProperty({ type: Boolean, example: true })
  valid: boolean;
}
