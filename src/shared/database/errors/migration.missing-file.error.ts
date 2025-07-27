export class MigrationMissingMigrationFilesException extends Error {
  constructor(message: string) {
    super(`Missing migration files: '${message}`);
  }
}
