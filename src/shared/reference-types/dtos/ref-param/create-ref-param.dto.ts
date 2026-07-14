import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString, Length } from 'class-validator';

export class CreateRefParamDto {
  @ApiProperty({ type: String })
  @IsString()
  @Length(3, 50)
  label: string;

  @ApiProperty({ type: String })
  @IsString()
  refTypeId: string;

  @ApiProperty({ type: Object })
  @IsObject()
  extras: object;
}
