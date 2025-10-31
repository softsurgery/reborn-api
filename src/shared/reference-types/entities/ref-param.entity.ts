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

  @ManyToOne(() => RefTypeEntity, (reftype) => reftype.params, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'refTypeId' })
  refType: RefTypeEntity;

  @Column({})
  refTypeId: number;
}
