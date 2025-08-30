import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateConversationDto {
  @ApiProperty({ type: String })
  @IsString()
  targetUserId: string;
}
