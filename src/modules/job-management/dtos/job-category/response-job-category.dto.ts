import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ResponseJobCategoryDto {
  @ApiProperty({ type: Number })
  @Expose()
  id: number;

  @ApiProperty({ type: String })
  @Expose()
  label: string;
}
