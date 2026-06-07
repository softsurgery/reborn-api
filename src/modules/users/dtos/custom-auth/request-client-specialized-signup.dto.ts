import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { RequestClientSignUpDto } from 'src/shared/auth/dtos/client/request-client-signup.dto';

export class RequestClientSpecializedSignUpDto extends RequestClientSignUpDto {
  @ApiProperty({ type: Number, example: 123 })
  @IsInt()
  pictureId?: number;
}
