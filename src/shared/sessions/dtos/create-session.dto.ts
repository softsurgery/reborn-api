import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsDate,
  IsObject,
  Validate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SessionType } from 'src/app/enums/session.enum';
import { DateOrderConstraint } from 'src/utils/validate-date-constraint';

export class CreateSessionDto {
  @ApiProperty({ enum: SessionType })
  @IsEnum(SessionType)
  type: SessionType;

  @ApiProperty({ type: Date, required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  planned_start?: Date;

  @ApiProperty({ type: Date, required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @Validate(DateOrderConstraint, ['planned_start', 'planned_end'])
  planned_end?: Date;

  @ApiProperty({ type: Object, required: false })
  @IsOptional()
  @IsObject()
  payload?: object;
}
