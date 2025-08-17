import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsString, Length } from 'class-validator';

export class CreateJobDto {
  @ApiProperty({ type: String })
  @IsString()
  @Length(10, 255)
  title: string;

  @ApiProperty({ type: String })
  @IsString()
  description: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsPositive()
  price: number;
}
