import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateEducationDto {
  @ApiProperty({ type: String })
  @IsString()
  school: string;
  @ApiProperty({ type: String })
  @IsString()
  degree: string;
  @ApiProperty({ type: Number })
  @IsNumber()
  startYear: number;
  @ApiProperty({ type: Number })
  @IsNumber()
  endYear: number;
}
