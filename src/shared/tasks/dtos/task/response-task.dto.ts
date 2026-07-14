import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ResponseDtoHelper } from 'src/shared/database/dtos/database.response.dto';
import { TaskVariant } from 'src/app/enums/task-variant.enum';
import { TaskStatus } from '../../enums/task-status.enum';

export class ResponseTaskDto extends ResponseDtoHelper {
  @ApiProperty({
    type: String,
  })
  @Expose()
  id: string;

  @ApiProperty({ enum: TaskVariant, example: TaskVariant.GENERAL })
  @Expose()
  variant: TaskVariant;

  @ApiProperty({ type: String, example: 'Complete onboarding profile' })
  @Expose()
  title: string;

  @ApiPropertyOptional({
    type: String,
  })
  @Expose()
  description?: string;

  @ApiProperty({ enum: TaskStatus, example: TaskStatus.PENDING })
  @Expose()
  status: TaskStatus;

  @ApiPropertyOptional({ type: Date })
  @Expose()
  dueDate?: Date;

  @ApiProperty({ type: Boolean, example: false })
  @Expose()
  isCompleted: boolean;

  @ApiPropertyOptional({
    type: String,
  })
  @Expose()
  userId?: string;
}
