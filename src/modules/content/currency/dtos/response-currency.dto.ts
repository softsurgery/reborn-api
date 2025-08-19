import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import { Expose } from 'class-transformer';
import { ResponseDtoHelper } from 'src/shared/database/dtos/database.response.dto';

export class ResponseCurrencyDto extends ResponseDtoHelper {
  @ApiProperty({ type: String, example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ type: String, example: faker.finance.currencyName() })
  @Expose()
  label: string;

  @ApiProperty({
    type: Number,
    example: faker.finance.currencyCode(),
  })
  @Expose()
  code?: string;

  @ApiProperty({
    type: Number,
    example: faker.finance.currencySymbol(),
  })
  @Expose()
  symbol?: string;

  @ApiProperty({ type: Number, example: 2 })
  @Expose()
  digitsAfterComma: number;
}
