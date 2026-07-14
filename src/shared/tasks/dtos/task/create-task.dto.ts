import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { TaskVariant } from 'src/app/enums/task-variant.enum';
import { TaskStatus } from '../../enums/task-status.enum';

export class CreateTaskDto {
  @ApiPropertyOptional({ enum: TaskVariant, default: TaskVariant.GENERAL })
  @IsOptional()
  @IsEnum(TaskVariant)
  variant?: TaskVariant;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  title: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: TaskStatus, default: TaskStatus.PENDING })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({ type: Date })
  @IsOptional()
  @IsDateString()
  dueDate?: Date;

  @ApiPropertyOptional({ type: Boolean, default: false })
  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsUUID()
  userId?: string;
}
