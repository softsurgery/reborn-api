import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class ComposeConversationDto {
  @ApiProperty({ type: String, isArray: true })
  @IsArray()
  participantIds: string[];
}
