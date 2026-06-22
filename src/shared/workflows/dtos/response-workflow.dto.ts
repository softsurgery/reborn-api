import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ResponseWorkflowDto {
  @ApiProperty({
    type: String,
    description: 'The current status of the entity',
  })
  @Expose()
  status: string;

  @ApiProperty({
    description: 'Whether the entity is updatable in its current state',
  })
  @Expose()
  nextSteps: { label: string }[];

  @ApiProperty({
    type: Boolean,
    description: 'Whether the entity is updatable in its current state',
  })
  @Expose()
  isUpdatable: boolean;
}
