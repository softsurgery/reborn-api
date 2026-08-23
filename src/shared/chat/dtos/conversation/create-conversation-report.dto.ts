import { ApiProperty } from '@nestjs/swagger';
import { ConversationReportReason } from '../../enums/conversation-report-reason.enum';
import { IsEnum, IsString, Length } from 'class-validator';

export class CreateConversationReportDto {
  @ApiProperty({ type: String, enum: ConversationReportReason })
  @IsEnum(ConversationReportReason)
  reason: ConversationReportReason;

  @ApiProperty({ type: String })
  @IsString()
  @Length(10, 1024)
  description: string;
}
