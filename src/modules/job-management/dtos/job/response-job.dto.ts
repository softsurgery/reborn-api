import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ResponseUserDto } from 'src/modules/user-management/dtos/user/response-user.dto';
import { ResponseDtoHelper } from 'src/shared/database/dtos/database.response.dto';
import { ResponseJobTagDto } from '../job-tag/response-job-tag.dto';
import { ResponseCurrencyDto } from 'src/modules/content/currency/dtos/response-currency.dto';

export class ResponseJobDto extends ResponseDtoHelper {
  @ApiProperty({ type: String })
  @Expose()
  id: string;

  @ApiProperty({ type: String })
  @Expose()
  title: string;

  @ApiProperty({ type: String })
  @Expose()
  description: string;

  @ApiProperty({ type: Number })
  @Expose()
  price: number;

  @ApiProperty({ type: ResponseUserDto })
  @Expose()
  @Type(() => ResponseUserDto)
  postedBy: ResponseUserDto;

  @ApiProperty({ type: String })
  @Expose()
  currencyId: string;

  @ApiProperty({ type: ResponseCurrencyDto })
  @Expose()
  @Type(() => ResponseCurrencyDto)
  currency: ResponseCurrencyDto;

  @ApiProperty({ type: [ResponseJobTagDto] })
  @Expose()
  @Type(() => ResponseJobTagDto)
  jobTags: ResponseJobTagDto[];
}
