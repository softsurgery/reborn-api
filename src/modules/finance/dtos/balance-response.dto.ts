import { Expose } from 'class-transformer';

export class BalanceResponseDto {
  @Expose()
  id: string;

  @Expose()
  points: number;

  @Expose()
  balance: number;
}
