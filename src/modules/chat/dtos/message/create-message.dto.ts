import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, MinLength } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({ type: String })
  @IsString()
  @MinLength(1)
  content: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  conversationId: number;
}
