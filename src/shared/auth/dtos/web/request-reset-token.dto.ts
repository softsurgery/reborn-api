import { ApiProperty } from '@nestjs/swagger';

export class RequestResetTokenDto {
  @ApiProperty({ type: String })
  usernameOrEmail: string;
}
