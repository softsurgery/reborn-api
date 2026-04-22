import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdateUserCoverDto {
  @ApiProperty({ description: 'ID of the cover image' })
  @IsNumber()
  coverId: number;
}
