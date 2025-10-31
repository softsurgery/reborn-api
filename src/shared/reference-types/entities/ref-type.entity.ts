import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RefParamEntity } from './ref-param.entity';

@Entity('ref-type')
export class RefTypeEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({})
  label: string;

  @Column({})
  description: string;

  @OneToMany(() => RefParamEntity, (user) => user.refType)
  params: RefParamEntity[];
}
