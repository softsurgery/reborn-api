import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateMessageLinkDto {
  @ApiProperty({ type: Number })
  @IsNumber()
  messageId: number;

  @ApiProperty({ type: String })
  @IsString()
  url: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  startOffset: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  endOffset: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  order: number;
}
