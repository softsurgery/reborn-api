import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StorageFolderEntity } from './storage-folder.entity';

@Entity('storage')
export class StorageEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({})
  slug: string;

  @Column({})
  filename: string;

  @Column({ nullable: true })
  systematicName?: string;

  @Column({})
  relativePath: string;

  @Column({})
  mimetype: string;

  @Column({})
  size: number;

  @Column({ default: false })
  isTemporary: boolean;

  @Column({ default: true })
  isPrivate: boolean;

  @ManyToOne(() => StorageFolderEntity, (folder) => folder.files, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'folderId' })
  folder?: StorageFolderEntity;

  @Column({ nullable: true })
  folderId?: number;
}
