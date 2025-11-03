import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString, MinLength } from 'class-validator';
import { MessageVariant } from '../../enums/message-variant.enum';

export class CreateMessageDto {
  @ApiProperty({ type: String })
  @IsString()
  @MinLength(1)
  content: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  conversationId: number;

  @ApiProperty({ type: String, enum: MessageVariant })
  @IsEnum(MessageVariant)
  variant: MessageVariant;
}
