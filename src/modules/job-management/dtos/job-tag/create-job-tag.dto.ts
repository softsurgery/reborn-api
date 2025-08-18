import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateJobTagDto {
  @ApiProperty({ type: String })
  @IsString()
  @Length(3, 50)
  label: string;
}
