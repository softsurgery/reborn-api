import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RefTypeEntity } from './ref-type.entity';

@Entity('ref-param')
export class RefParamEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({})
  label: string;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  description: string;

  @ManyToOne(() => RefTypeEntity, (reftype) => reftype.params, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'refTypeId' })
  refType: RefTypeEntity;

  @Column({})
  refTypeId: number;

  @Column({ type: 'json', nullable: true })
  extras: object;
}
