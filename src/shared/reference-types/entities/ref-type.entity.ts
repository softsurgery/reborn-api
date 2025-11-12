import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RefParamEntity } from './ref-param.entity';

@Entity('ref-type')
export class RefTypeEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  label: string;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  description: string;

  @OneToMany(() => RefParamEntity, (user) => user.refType)
  params: RefParamEntity[];

  @ManyToOne(() => RefTypeEntity, (reftype) => reftype.children, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'parentId' })
  parent?: RefTypeEntity;

  @Column({ nullable: true })
  parentId: number;

  @OneToMany(() => RefTypeEntity, (user) => user.parent)
  children: RefTypeEntity[];
}
