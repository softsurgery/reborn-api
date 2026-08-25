import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class UpdateUserSkillsDto {
  @ApiProperty({ isArray: true, description: 'ID of skills' })
  @IsArray()
  skills: number[];
}
