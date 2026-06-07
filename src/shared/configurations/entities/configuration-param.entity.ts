import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ConfigurationNamespaceEntity } from './configuration-namespace.entity';
import { ParamVariant } from '../enums/param-variant.enum';

@Entity('configuration-param')
export class ConfigurationParamEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string;

  @ManyToOne(
    () => ConfigurationNamespaceEntity,
    (namespace) => namespace.params,
  )
  @JoinColumn({ name: 'namespaceId' })
  namespace: ConfigurationNamespaceEntity;

  @Column()
  namespaceId: string;

  @Column({ type: 'enum', enum: ParamVariant, default: ParamVariant.STRING })
  variant: ParamVariant;

  @Column({ type: 'varchar', length: 255, default: '' })
  value: string;

  @Column({ type: 'json', nullable: true })
  options?: { label: string; value: string }[];
}
