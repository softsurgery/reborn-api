import * as semver from 'semver';
import * as crc32 from 'crc-32';

export class MigrationFile {
  version: string;
  description: string;
  checksum: number;
  repeated: boolean = false;
  script: string;
  content: string;

  constructor(
    version: string,
    description: string,
    script: string,
    content: string,
  ) {
    this.version = version;
    this.description = description;
    this.script = script;
    this.setContent(content);
  }

  static initializeEmptyMigrationFile() {
    return new MigrationFile('', '', '', '');
  }

  private static getCRC32Checksum(content: string): number {
    return crc32.str(content.replace(/\s/g, ''));
  }

  setContent(content: string): void {
    this.checksum = MigrationFile.getCRC32Checksum(content);
    this.content = content;
  }

  compareTo(other: MigrationFile): number {
    if (!semver.valid(this.version) || !semver.valid(other.version)) {
      throw new Error(
        `Invalid semver version(s) - ${this.version} or ${other.version}`,
      );
    }

    return semver.compare(this.version, other.version);
  }
}
