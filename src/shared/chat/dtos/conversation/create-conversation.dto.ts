import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateConversationDto {
  @ApiProperty({ isArray: true, type: String })
  @IsString({ each: true })
  users: string[];
}
