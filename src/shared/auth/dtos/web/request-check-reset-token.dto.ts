import { ApiProperty } from '@nestjs/swagger';

export class RequestCheckResetTokenDto {
  @ApiProperty({ type: String })
  token: string;
}
