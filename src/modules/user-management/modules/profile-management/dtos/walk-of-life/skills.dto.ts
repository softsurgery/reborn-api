import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SkillDto {
  @ApiProperty()
  @Expose()
  name: string;
}
