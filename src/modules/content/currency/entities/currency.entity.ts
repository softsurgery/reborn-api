import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('currencies')
export class CurrencyEntity extends EntityHelper {
  @PrimaryColumn()
  id: string;

  @Column({ length: 255 })
  label: string;

  @Column({ length: 3 })
  code: string;

  @Column({ length: 10, nullable: true })
  symbol?: string;

  @Column({ nullable: true })
  digitsAfterComma?: number;
}
