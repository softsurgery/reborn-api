import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject, IsString, Length } from 'class-validator';

export class CreateRefParamDto {
  @ApiProperty({ type: String })
  @IsString()
  @Length(3, 50)
  label: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  refTypeId: number;

  @ApiProperty({ type: Object })
  @IsObject()
  extras: object;
}
