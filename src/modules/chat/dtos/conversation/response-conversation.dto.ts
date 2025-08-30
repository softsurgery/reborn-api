import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ResponseDtoHelper } from 'src/shared/database/dtos/database.response.dto';

export class ResponseConversationDto extends ResponseDtoHelper {
  @ApiProperty({ type: Number })
  @Expose()
  id: number;

  @ApiProperty({ type: [String] })
  @Expose()
  participants: string[];
}
