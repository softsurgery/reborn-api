import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  IsNumber,
} from 'class-validator';

export class CreateCurrencyDto {
  @ApiProperty({ type: String, example: 1 })
  @IsNotEmpty()
  id: string;

  @ApiProperty({ type: String, example: faker.finance.currencyName() })
  @IsString()
  @Length(3, 255)
  label: string;

  @ApiProperty({
    type: Number,
    example: faker.finance.currencyCode(),
  })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  code?: string;

  @ApiProperty({
    type: Number,
    example: faker.finance.currencySymbol(),
  })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  symbol?: string;

  @ApiProperty({ type: Number, example: 2 })
  @IsNumber()
  digitsAfterComma: number;
}
