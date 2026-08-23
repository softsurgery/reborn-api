import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { MessageVariant } from '../../enums/message-variant.enum';
import { StaticMessageEnum } from 'src/app/enums/static-message.enum';

export class CreateMessageDto {
  @ApiProperty({ type: String })
  @ValidateIf(
    (dto: CreateMessageDto) =>
      !dto.uploadIds?.length && dto.variant !== MessageVariant.STATIC,
  )
  @IsString()
  @MinLength(1)
  @IsOptional()
  content?: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  conversationId: number;

  @ApiProperty({ type: String, enum: MessageVariant })
  @IsEnum(MessageVariant)
  @IsOptional()
  variant?: MessageVariant;

  @ApiProperty({ type: String, enum: StaticMessageEnum })
  @IsEnum(StaticMessageEnum)
  @IsOptional()
  static?: StaticMessageEnum;

  @ApiProperty({ type: [Number], description: 'IDs of uploaded files' })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  uploadIds?: number[];
}
