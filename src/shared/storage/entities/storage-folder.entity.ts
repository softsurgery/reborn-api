import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StorageEntity } from './storage.entity';

@Entity('storage_folder')
export class StorageFolderEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true, unique: true })
  systematicName?: string;

  @ManyToOne(() => StorageFolderEntity, (folder) => folder.children, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'parentId' })
  parent?: StorageFolderEntity;

  @Column({ nullable: true })
  parentId?: number;

  @OneToMany(() => StorageFolderEntity, (folder) => folder.parent)
  children: StorageFolderEntity[];

  @OneToMany(() => StorageEntity, (storage) => storage.folder)
  files: StorageEntity[];
}
