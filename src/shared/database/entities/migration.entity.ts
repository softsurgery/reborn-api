import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EntityHelper } from '../interfaces/database.entity.interface';
import * as semver from 'semver';

@Entity('migrations')
export class MigrationEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  version: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  checksum: number;

  @Column()
  script: string;

  @Column({ default: false })
  success: boolean;

  compareTo(other: MigrationEntity): number {
    if (!semver.valid(this.version) || !semver.valid(other.version)) {
      throw new Error(
        `Invalid semver version(s) - ${this.version} or ${other.version}`,
      );
    }

    return semver.compare(this.version, other.version);
  }
}
