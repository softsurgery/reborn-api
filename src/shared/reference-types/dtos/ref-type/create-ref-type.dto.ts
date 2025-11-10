import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateRefTypeDto {
  @ApiProperty({ type: String })
  @IsString()
  @Length(3, 50)
  label: string;

  @ApiProperty({ type: String })
  @IsString()
  @MaxLength(255)
  description: string;

  @ApiProperty({ type: String })
  @IsNumber()
  @IsOptional()
  parentId?: number;
}
