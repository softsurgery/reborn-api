import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class TransactionRequestDto {
  @ApiProperty({ type: Number, example: 50 })
  @IsNumber()
  @IsPositive()
  amount: number;
}
