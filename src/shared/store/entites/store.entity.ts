import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('store')
export class StoreEntity extends EntityHelper {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string;

  @Column({ type: 'json', nullable: true })
  value: object;
}
